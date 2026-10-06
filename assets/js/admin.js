/**
 * MORDEN TOURIST (mordentourist.com) - Admin Panel Logic
 * Package Management (Add, Edit, Delete, Filter, Export/Import) & Inquiry Tracker
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Authentication Check & Login Handler
  const loginOverlay = document.getElementById("loginOverlay");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const logoutBtn = document.getElementById("logoutBtn");

  const DEFAULT_USER = "admin";
  const DEFAULT_PASS = "morden2026";

  function checkAuth() {
    const isLoggedIn = sessionStorage.getItem("morden_admin_auth") === "true";
    if (loginOverlay) {
      if (isLoggedIn) {
        loginOverlay.style.display = "none";
      } else {
        loginOverlay.style.display = "flex";
      }
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("loginUser")?.value.trim();
      const pass = document.getElementById("loginPass")?.value;

      const storedPass = localStorage.getItem("morden_admin_custom_pass") || DEFAULT_PASS;

      if (user === DEFAULT_USER && pass === storedPass) {
        sessionStorage.setItem("morden_admin_auth", "true");
        loginOverlay.style.display = "none";
        loginError.style.display = "none";
        showToast("Welcome back, Administrator!");
        initDashboard();
      } else {
        loginError.textContent = "Invalid username or password. (Default: admin / morden2026)";
        loginError.style.display = "block";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("morden_admin_auth");
      checkAuth();
      showToast("Logged out successfully.");
    });
  }

  checkAuth();

  // 2. Navigation Tabs (Packages, Inquiries, Settings)
  const navLinks = document.querySelectorAll(".sidebar-link[data-tab]");
  const tabPanes = document.querySelectorAll(".tab-pane");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tabName = link.getAttribute("data-tab");
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      tabPanes.forEach(pane => {
        pane.style.display = pane.id === tabName ? "block" : "none";
      });

      if (tabName === "tabInquiries") {
        renderInquiriesTable();
      }
      if (window.innerWidth <= 991) {
        document.getElementById("adminSidebar")?.classList.remove("open");
      }
    });
  });

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  const adminSidebar = document.getElementById("adminSidebar");
  if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener("click", () => {
      adminSidebar.classList.toggle("open");
    });
  }

  // 3. Available Destination Images for Selector
  const AVAILABLE_IMAGES = [
    { label: "Yas Island (Abu Dhabi)", path: "assets/images/destinations/yas-island.jpg" },
    { label: "Saadiyat Island (Louvre)", path: "assets/images/destinations/saadiyat-island.jpg" },
    { label: "Sir Bani Yas Safari", path: "assets/images/destinations/sir-bani-yas.jpg" },
    { label: "Jubail Mangroves Park", path: "assets/images/destinations/jubail-mangroves.jpg" },
    { label: "Havelock Island (Andaman)", path: "assets/images/destinations/havelock-island.jpg" },
    { label: "Bangaram Coral Atoll", path: "assets/images/destinations/bangaram-atoll.jpg" },
    { label: "Al Maya Private Island", path: "assets/images/destinations/al-maya.jpg" },
    { label: "Dalma Island Heritage", path: "assets/images/destinations/dalma-island.jpg" },
    { label: "Zaya Nurai Island Luxury", path: "assets/images/destinations/nurai-island.jpg" },
    { label: "Al Maryah Waterfront", path: "assets/images/destinations/al-maryah.jpg" },
    { label: "Grand Island (Goa)", path: "assets/images/destinations/grand-island.jpg" },
    { label: "St. Mary's Basalt Isle", path: "assets/images/destinations/st-marys.jpg" },
    { label: "Spotlight Archipelago", path: "assets/images/spotlight-abudhabi.jpg" }
  ];

  function populateImageSelector(gridId, inputId, previewId, selectedPath = "") {
    const grid = document.getElementById(gridId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!grid) return;

    grid.innerHTML = "";
    AVAILABLE_IMAGES.forEach(imgObj => {
      const opt = document.createElement("div");
      opt.className = "image-option" + (selectedPath === imgObj.path ? " selected" : "");
      opt.title = imgObj.label;
      opt.innerHTML = `<img src="${imgObj.path}" alt="${imgObj.label}" loading="lazy">`;
      opt.addEventListener("click", () => {
        grid.querySelectorAll(".image-option").forEach(el => el.classList.remove("selected"));
        opt.classList.add("selected");
        if (input) input.value = imgObj.path;
        if (preview) {
          preview.src = imgObj.path;
          preview.style.display = "block";
        }
      });
      grid.appendChild(opt);
    });
  }

  // 4. Dashboard Metrics Calculation
  function updateMetrics() {
    const packages = PackagesManager.getAll();
    const inquiries = InquiriesManager.getAll();

    const totalPkgEl = document.getElementById("metricTotalPackages");
    const avgPriceEl = document.getElementById("metricAvgPrice");
    const activeCatEl = document.getElementById("metricCategories");
    const totalInqEl = document.getElementById("metricInquiries");
    const pkgBadgeEl = document.getElementById("sidebarPkgBadge");
    const inqBadgeEl = document.getElementById("sidebarInqBadge");

    if (totalPkgEl) totalPkgEl.textContent = packages.length;
    if (pkgBadgeEl) pkgBadgeEl.textContent = packages.length;

    if (avgPriceEl && packages.length > 0) {
      const sum = packages.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
      const avg = Math.round(sum / packages.length);
      avgPriceEl.textContent = "₹" + avg.toLocaleString("en-IN");
    }

    if (activeCatEl) {
      const categories = new Set();
      packages.forEach(p => {
        if (p.category) {
          p.category.split(" ").forEach(c => categories.add(c.trim()));
        }
      });
      activeCatEl.textContent = categories.size;
    }

    if (totalInqEl) totalInqEl.textContent = inquiries.length;
    if (inqBadgeEl) inqBadgeEl.textContent = inquiries.length;
  }

  // 5. Render Packages Table
  function renderPackagesTable() {
    const tableBody = document.getElementById("packagesTableBody");
    if (!tableBody) return;

    const packages = PackagesManager.getAll();
    const searchTerm = document.getElementById("searchPackageInput")?.value.toLowerCase().trim() || "";
    const filterCat = document.getElementById("filterCategorySelect")?.value || "all";
    const sortBy = document.getElementById("sortPackageSelect")?.value || "newest";

    let filtered = packages.filter(pkg => {
      const matchSearch = !searchTerm || 
        pkg.title.toLowerCase().includes(searchTerm) || 
        pkg.location.toLowerCase().includes(searchTerm) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchTerm));
      
      const matchCat = filterCat === "all" || (pkg.category && pkg.category.includes(filterCat));

      return matchSearch && matchCat;
    });

    // Sorting
    if (sortBy === "priceAsc") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceDesc") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    tableBody.innerHTML = "";

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
            <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
            No packages match your search criteria.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(pkg => {
      const tr = document.createElement("tr");

      // Badge style
      const catClass = pkg.category.includes("luxury") ? "badge-luxury" :
                       pkg.category.includes("adventure") ? "badge-adventure" :
                       pkg.category.includes("family") ? "badge-family" : "badge-culture";

      tr.innerHTML = `
        <td>
          <div class="package-cell">
            <img src="${pkg.image}" alt="${pkg.title}" class="package-thumb" onerror="this.src='assets/images/destinations/yas-island.jpg'">
            <div>
              <div class="package-name">${pkg.title}</div>
              <div class="package-loc"><i class="fa-solid fa-location-dot"></i> ${pkg.location}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge-pill ${catClass}">${pkg.category}</span>
          ${pkg.badge ? `<br><small style="color: var(--color-coral); font-weight: 600;">${pkg.badge}</small>` : ''}
        </td>
        <td>
          <strong>${pkg.priceFormatted || ('₹' + pkg.price)}</strong>
          <br><small style="color: var(--color-text-muted);">${pkg.priceUnit || '/person'}</small>
        </td>
        <td>
          <span style="color: #F59E0B; font-weight: 700;"><i class="fa-solid fa-star"></i> ${pkg.rating}</span>
        </td>
        <td>
          <span class="badge-pill badge-active">Active</span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-outline btn-sm btn-icon edit-pkg-btn" data-id="${pkg.id}" title="Edit Package">
              <i class="fa-solid fa-pen-to-square" style="color: var(--color-secondary);"></i>
            </button>
            <button class="btn btn-outline btn-sm btn-icon delete-pkg-btn" data-id="${pkg.id}" title="Delete Package">
              <i class="fa-solid fa-trash" style="color: var(--color-danger);"></i>
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Attach row button actions
    tableBody.querySelectorAll(".edit-pkg-btn").forEach(btn => {
      btn.addEventListener("click", () => openEditModal(btn.getAttribute("data-id")));
    });

    tableBody.querySelectorAll(".delete-pkg-btn").forEach(btn => {
      btn.addEventListener("click", () => openDeleteModal(btn.getAttribute("data-id")));
    });
  }

  // 6. Add Package Modal & Logic
  const addModal = document.getElementById("addPackageModal");
  const openAddBtn = document.getElementById("openAddPackageBtn");
  const addForm = document.getElementById("addPackageForm");

  if (openAddBtn && addModal) {
    openAddBtn.addEventListener("click", () => {
      if (addForm) addForm.reset();
      populateImageSelector("addImageSelectorGrid", "addPkgImageInput", "addPkgImagePreview", "assets/images/destinations/yas-island.jpg");
      document.getElementById("addPkgImageInput").value = "assets/images/destinations/yas-island.jpg";
      const preview = document.getElementById("addPkgImagePreview");
      if (preview) {
        preview.src = "assets/images/destinations/yas-island.jpg";
        preview.style.display = "block";
      }
      addModal.classList.add("active");
    });
  }

  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("addPkgTitle")?.value.trim();
      const location = document.getElementById("addPkgLocation")?.value.trim();
      const category = document.getElementById("addPkgCategory")?.value.trim();
      const badge = document.getElementById("addPkgBadge")?.value.trim();
      const price = Number(document.getElementById("addPkgPrice")?.value) || 35000;
      const priceUnit = document.getElementById("addPkgUnit")?.value.trim() || "/person";
      const rating = Number(document.getElementById("addPkgRating")?.value) || 4.9;
      const image = document.getElementById("addPkgImageInput")?.value.trim() || "assets/images/destinations/yas-island.jpg";
      const description = document.getElementById("addPkgDescription")?.value.trim();
      
      const featuresRaw = document.getElementById("addPkgFeatures")?.value.trim();
      const features = (featuresRaw ? featuresRaw.split(",") : ["Top Attraction", "VIP Passes", "Private Transfers"])
        .map(f => ({ icon: "fa-check", text: f.trim() }))
        .filter(f => f.text);

      const inclusionsRaw = document.getElementById("addPkgInclusions")?.value.trim();
      const inclusions = inclusionsRaw 
        ? inclusionsRaw.split(",").map(i => i.trim()).filter(Boolean)
        : ["Hotel Accommodation", "Guided Excursions", "Airport Transfers"];

      const newPkg = {
        title,
        location,
        category,
        badge,
        badgeClass: badge ? "highlight" : "",
        price,
        priceFormatted: "₹" + price.toLocaleString("en-IN"),
        priceUnit,
        rating,
        image,
        description,
        features,
        inclusions,
        status: "active"
      };

      PackagesManager.add(newPkg);
      showToast(`Package "${title}" created successfully!`);
      addModal.classList.remove("active");
      updateMetrics();
      renderPackagesTable();
    });
  }

  // Handle custom image file upload for Add modal
  const addImageUpload = document.getElementById("addPkgImageUpload");
  if (addImageUpload) {
    addImageUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          document.getElementById("addPkgImageInput").value = dataUrl;
          const preview = document.getElementById("addPkgImagePreview");
          if (preview) {
            preview.src = dataUrl;
            preview.style.display = "block";
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 7. Edit Package Modal & Logic
  const editModal = document.getElementById("editPackageModal");
  const editForm = document.getElementById("editPackageForm");

  function openEditModal(pkgId) {
    const pkg = PackagesManager.getById(pkgId);
    if (!pkg || !editModal) return;

    document.getElementById("editPkgId").value = pkg.id;
    document.getElementById("editPkgTitle").value = pkg.title;
    document.getElementById("editPkgLocation").value = pkg.location;
    document.getElementById("editPkgCategory").value = pkg.category;
    document.getElementById("editPkgBadge").value = pkg.badge || "";
    document.getElementById("editPkgPrice").value = pkg.price;
    document.getElementById("editPkgUnit").value = pkg.priceUnit || "/person";
    document.getElementById("editPkgRating").value = pkg.rating || 4.9;
    document.getElementById("editPkgImageInput").value = pkg.image;
    document.getElementById("editPkgDescription").value = pkg.description || "";

    const featuresText = (pkg.features || []).map(f => f.text).join(", ");
    document.getElementById("editPkgFeatures").value = featuresText;

    const inclusionsText = (pkg.inclusions || []).join(", ");
    document.getElementById("editPkgInclusions").value = inclusionsText;

    populateImageSelector("editImageSelectorGrid", "editPkgImageInput", "editPkgImagePreview", pkg.image);
    const preview = document.getElementById("editPkgImagePreview");
    if (preview) {
      preview.src = pkg.image;
      preview.style.display = "block";
    }

    editModal.classList.add("active");
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("editPkgId")?.value;
      const title = document.getElementById("editPkgTitle")?.value.trim();
      const location = document.getElementById("editPkgLocation")?.value.trim();
      const category = document.getElementById("editPkgCategory")?.value.trim();
      const badge = document.getElementById("editPkgBadge")?.value.trim();
      const price = Number(document.getElementById("editPkgPrice")?.value) || 35000;
      const priceUnit = document.getElementById("editPkgUnit")?.value.trim() || "/person";
      const rating = Number(document.getElementById("editPkgRating")?.value) || 4.9;
      const image = document.getElementById("editPkgImageInput")?.value.trim();
      const description = document.getElementById("editPkgDescription")?.value.trim();

      const featuresRaw = document.getElementById("editPkgFeatures")?.value.trim();
      const features = (featuresRaw ? featuresRaw.split(",") : [])
        .map(f => ({ icon: "fa-check", text: f.trim() }))
        .filter(f => f.text);

      const inclusionsRaw = document.getElementById("editPkgInclusions")?.value.trim();
      const inclusions = inclusionsRaw 
        ? inclusionsRaw.split(",").map(i => i.trim()).filter(Boolean)
        : [];

      const updatedData = {
        title,
        location,
        category,
        badge,
        badgeClass: badge ? "highlight" : "",
        price,
        priceFormatted: "₹" + price.toLocaleString("en-IN"),
        priceUnit,
        rating,
        image,
        description,
        features,
        inclusions
      };

      PackagesManager.update(id, updatedData);
      showToast(`Package "${title}" updated successfully!`);
      editModal.classList.remove("active");
      updateMetrics();
      renderPackagesTable();
    });
  }

  const editImageUpload = document.getElementById("editPkgImageUpload");
  if (editImageUpload) {
    editImageUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          document.getElementById("editPkgImageInput").value = dataUrl;
          const preview = document.getElementById("editPkgImagePreview");
          if (preview) {
            preview.src = dataUrl;
            preview.style.display = "block";
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 8. Delete Package Modal & Confirmation
  const deleteModal = document.getElementById("deletePackageModal");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  let pendingDeleteId = null;

  function openDeleteModal(pkgId) {
    const pkg = PackagesManager.getById(pkgId);
    if (!pkg || !deleteModal) return;

    pendingDeleteId = pkgId;
    const nameEl = document.getElementById("deletePkgTitle");
    if (nameEl) nameEl.textContent = `"${pkg.title}" (${pkg.location})`;

    deleteModal.classList.add("active");
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      if (pendingDeleteId) {
        PackagesManager.delete(pendingDeleteId);
        showToast("Package deleted successfully.");
        pendingDeleteId = null;
        deleteModal.classList.remove("active");
        updateMetrics();
        renderPackagesTable();
      }
    });
  }

  // Close modals on clicking overlay or close button
  document.querySelectorAll(".modal-close, .modal-cancel").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
    });
  });

  // 9. Search, Filter & Sort Event Listeners
  const searchInput = document.getElementById("searchPackageInput");
  const filterCatSelect = document.getElementById("filterCategorySelect");
  const sortSelect = document.getElementById("sortPackageSelect");

  if (searchInput) searchInput.addEventListener("input", renderPackagesTable);
  if (filterCatSelect) filterCatSelect.addEventListener("change", renderPackagesTable);
  if (sortSelect) sortSelect.addEventListener("change", renderPackagesTable);

  // 10. Export JSON & Import JSON & Reset
  const exportBtn = document.getElementById("exportPackagesBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(PackagesManager.exportJSON());
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `morden-tourist-packages-${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Packages exported as JSON file.");
    });
  }

  const importInput = document.getElementById("importFileInput");
  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = PackagesManager.importJSON(event.target.result);
          if (res.success) {
            showToast(`Successfully imported ${res.count} packages!`);
            updateMetrics();
            renderPackagesTable();
          } else {
            alert("Error importing packages: " + res.error);
          }
        };
        reader.readAsText(file);
      }
    });
  }

  const resetBtn = document.getElementById("resetPackagesBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all packages to the default 12 signature island packages? This will replace any custom packages.")) {
        PackagesManager.resetToDefault();
        showToast("Packages database reset to original 12 destinations!");
        updateMetrics();
        renderPackagesTable();
      }
    });
  }

  // 11. Inquiries Table & Clear
  function renderInquiriesTable() {
    const tableBody = document.getElementById("inquiriesTableBody");
    if (!tableBody) return;

    const inquiries = InquiriesManager.getAll();
    tableBody.innerHTML = "";

    if (inquiries.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
            <i class="fa-brands fa-whatsapp" style="font-size: 2rem; color: #25D366; margin-bottom: 10px; display: block;"></i>
            No inquiries recorded yet. When visitors submit the booking modal or contact form, they will appear here.
          </td>
        </tr>
      `;
      return;
    }

    inquiries.forEach(inq => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><small style="color: var(--color-text-muted);">${inq.timestamp || 'Recent'}</small></td>
        <td><strong>${inq.name || 'Guest'}</strong></td>
        <td><a href="tel:${inq.phone}" style="color: var(--color-secondary);"><i class="fa-solid fa-phone"></i> ${inq.phone || 'N/A'}</a></td>
        <td>${inq.email || '-'}</td>
        <td><span class="badge-pill badge-adventure">${inq.destination || 'General Tour'}</span></td>
        <td>
          <a href="https://wa.me/918351917891?text=${encodeURIComponent('Hello ' + inq.name + ', following up on your Morden Tourist inquiry for ' + inq.destination)}" target="_blank" class="btn btn-outline btn-sm" style="color: #25D366; border-color: #25D366;">
            <i class="fa-brands fa-whatsapp"></i> Chat
          </a>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  const clearInqBtn = document.getElementById("clearInquiriesBtn");
  if (clearInqBtn) {
    clearInqBtn.addEventListener("click", () => {
      if (confirm("Clear all recorded inquiries?")) {
        InquiriesManager.clear();
        renderInquiriesTable();
        updateMetrics();
        showToast("Inquiries log cleared.");
      }
    });
  }

  // 12. Settings Tab (Change Password & Contacts)
  const settingsForm = document.getElementById("adminSettingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newPass = document.getElementById("settingsNewPass")?.value;
      const confirmPass = document.getElementById("settingsConfirmPass")?.value;

      if (newPass) {
        if (newPass !== confirmPass) {
          alert("New passwords do not match!");
          return;
        }
        localStorage.setItem("morden_admin_custom_pass", newPass);
        showToast("Admin password changed successfully!");
      } else {
        showToast("Settings saved.");
      }
    });
  }

  // Toast Notification
  function showToast(message) {
    let toast = document.querySelector(".admin-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "admin-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #2DD4BF; font-size: 1.2rem;"></i> <span>${message}</span>`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  function initDashboard() {
    updateMetrics();
    renderPackagesTable();
  }

  initDashboard();
});
