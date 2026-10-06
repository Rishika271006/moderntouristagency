/**
 * MORDEN TOURIST (mordentourist.com) - Interactive Scripts
 * Destination Filtering, Booking Modal, Mobile Nav & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  }

  // 2. Sticky Navbar on Scroll
  const mainHeader = document.querySelector('.main-header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader?.classList.add('scrolled');
    } else {
      mainHeader?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. One Row Destination Slider & Category Filter System
  function initDestinationSlider() {
    const wrappers = document.querySelectorAll('.destination-slider-wrapper');
    if (!wrappers.length) return;

    wrappers.forEach(wrapper => {
      const track = wrapper.querySelector('.destination-slider-track') || wrapper.querySelector('.destination-grid');
      if (!track) return;

      const prevBtn = wrapper.querySelector('.slider-btn-prev');
      const nextBtn = wrapper.querySelector('.slider-btn-next');
      const dotsContainer = wrapper.parentElement?.querySelector('.slider-dots') || document.getElementById('sliderDotsContainer');

      function getVisibleCards() {
        return Array.from(track.querySelectorAll('.destination-card')).filter(card => {
          return card.style.display !== 'none' && window.getComputedStyle(card).display !== 'none';
        });
      }

      function getCardStep() {
        const visible = getVisibleCards();
        if (visible.length > 0) {
          const cardWidth = visible[0].getBoundingClientRect().width;
          const trackStyle = window.getComputedStyle(track);
          const gap = parseFloat(trackStyle.gap) || 28;
          return cardWidth + gap;
        }
        return 360;
      }

      function updateNavState() {
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const currentScroll = track.scrollLeft;

        if (maxScroll <= 8) {
          if (prevBtn) {
            prevBtn.disabled = true;
            prevBtn.classList.add('disabled');
          }
          if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
          }
        } else {
          if (prevBtn) {
            const isAtStart = currentScroll <= 10;
            prevBtn.disabled = isAtStart;
            prevBtn.classList.toggle('disabled', isAtStart);
          }
          if (nextBtn) {
            const isAtEnd = currentScroll >= maxScroll - 10;
            nextBtn.disabled = isAtEnd;
            nextBtn.classList.toggle('disabled', isAtEnd);
          }
        }

        updateActiveDot();
      }

      function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const visibleCards = getVisibleCards();
        if (visibleCards.length <= 1) return;

        const step = getCardStep();
        const inView = Math.max(1, Math.round(track.clientWidth / step));
        const totalSteps = Math.max(1, visibleCards.length - inView + 1);

        visibleCards.forEach((card, idx) => {
          if (idx >= totalSteps && totalSteps < visibleCards.length && idx >= 8) return;
          const dot = document.createElement('button');
          dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
          dot.setAttribute('aria-label', `Go to destination slide ${idx + 1}`);
          dot.setAttribute('type', 'button');
          dot.addEventListener('click', () => {
            const targetCard = visibleCards[idx];
            if (targetCard) {
              const targetOffset = targetCard.offsetLeft - track.offsetLeft - 8;
              track.scrollTo({ left: Math.max(0, targetOffset), behavior: 'smooth' });
            }
          });
          dotsContainer.appendChild(dot);
        });
      }

      function updateActiveDot() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        if (!dots.length) return;

        const visibleCards = getVisibleCards();
        if (!visibleCards.length) return;

        const currentScroll = track.scrollLeft;
        let closestIndex = 0;
        let minDiff = Infinity;

        visibleCards.forEach((card, idx) => {
          const cardOffset = card.offsetLeft - track.offsetLeft - 8;
          const diff = Math.abs(cardOffset - currentScroll);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        const activeIndex = Math.min(closestIndex, dots.length - 1);
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }

      // Prev Button Click
      if (prevBtn && !prevBtn.dataset.boundSlider) {
        prevBtn.dataset.boundSlider = 'true';
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const step = getCardStep();
          track.scrollBy({ left: -step, behavior: 'smooth' });
          setTimeout(updateNavState, 350);
        });
      }

      // Next Button Click
      if (nextBtn && !nextBtn.dataset.boundSlider) {
        nextBtn.dataset.boundSlider = 'true';
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const step = getCardStep();
          track.scrollBy({ left: step, behavior: 'smooth' });
          setTimeout(updateNavState, 350);
        });
      }

      // Track Scroll Event (passive)
      let scrollTimer = null;
      track.addEventListener('scroll', () => {
        if (scrollTimer) cancelAnimationFrame(scrollTimer);
        scrollTimer = requestAnimationFrame(updateNavState);
      }, { passive: true });

      // Mouse drag-to-scroll on desktop
      if (!track.dataset.boundDrag) {
        track.dataset.boundDrag = 'true';
        let isDown = false;
        let startX = 0;
        let scrollStart = 0;
        let draggedDist = 0;

        track.addEventListener('mousedown', (e) => {
          if (e.target.closest('button, a, input, select')) return;
          isDown = true;
          draggedDist = 0;
          startX = e.pageX - track.offsetLeft;
          scrollStart = track.scrollLeft;
          track.style.scrollBehavior = 'auto';
          track.style.scrollSnapType = 'none';
        });

        window.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          const x = e.pageX - track.offsetLeft;
          const walk = (x - startX);
          draggedDist = Math.abs(walk);
          track.scrollLeft = scrollStart - walk;
        });

        window.addEventListener('mouseup', () => {
          if (isDown) {
            isDown = false;
            track.style.scrollBehavior = 'smooth';
            track.style.scrollSnapType = 'x mandatory';
            setTimeout(updateNavState, 150);
          }
        });

        track.addEventListener('click', (e) => {
          if (draggedDist > 10) {
            e.preventDefault();
            e.stopPropagation();
            draggedDist = 0;
          }
        }, true);
      }

      // Keyboard arrow navigation
      wrapper.setAttribute('tabindex', '0');
      wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (nextBtn && !nextBtn.disabled) nextBtn.click();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (prevBtn && !prevBtn.disabled) prevBtn.click();
        }
      });

      // Initial dots and state setup
      createDots();
      updateNavState();

      // Expose refresh hook on wrapper
      wrapper.refreshSlider = () => {
        createDots();
        updateNavState();
      };
    });
  }

  window.initDestinationSlider = initDestinationSlider;
  window.refreshDestinationSlider = () => {
    document.querySelectorAll('.destination-slider-wrapper').forEach(w => {
      if (typeof w.refreshSlider === 'function') w.refreshSlider();
    });
  };

  // Render dynamic cards from PackagesManager if present
  if (window.PackagesManager && document.querySelector('.destination-grid')) {
    window.PackagesManager.renderToGrid('.destination-grid', 'all');
  } else {
    // Static HTML fallback
    initDestinationSlider();
  }

  // Window resize debounced listener for slider indicators
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      window.refreshDestinationSlider();
    }, 200);
  });

  // Filter Buttons Interaction
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        const currentCards = document.querySelectorAll('.destination-card');

        currentCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });

        // Reset track scroll position to beginning smoothly
        const tracks = document.querySelectorAll('.destination-slider-track');
        tracks.forEach(t => {
          t.scrollTo({ left: 0, behavior: 'smooth' });
        });

        // Refresh dots and nav buttons for filtered items
        setTimeout(() => {
          window.refreshDestinationSlider();
        }, 150);
      });
    });

    // Check URL parameters for pre-selected filter (e.g. tourist-places.html?filter=luxury)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter') || urlParams.get('type');
    if (filterParam && filterParam !== 'all') {
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  }

  // 4. Hero Search Functionality
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const destSelect = document.getElementById('searchDestination')?.value;
      const typeSelect = document.getElementById('searchType')?.value;

      const destSection = document.getElementById('destinations-section');
      if (destSection) {
        destSection.scrollIntoView({ behavior: 'smooth' });
        if (typeSelect && typeSelect !== 'all') {
          const matchBtn = document.querySelector(`.filter-btn[data-filter="${typeSelect}"]`);
          if (matchBtn) matchBtn.click();
        }
      } else {
        // Direct to dedicated tourist-places.html page under services
        const params = new URLSearchParams();
        if (typeSelect && typeSelect !== 'all') params.set('filter', typeSelect);
        if (destSelect && destSelect !== 'all') params.set('dest', destSelect);
        const queryStr = params.toString() ? '?' + params.toString() : '';
        window.location.href = `tourist-places.html${queryStr}`;
      }
    });
  }

  // Mobile Dropdown Click Support
  const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentDropdown = toggle.closest('.nav-dropdown');
        if (parentDropdown) {
          parentDropdown.classList.toggle('active');
        }
      }
    });
  });

  // 5. Booking / Consultation Modal
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDestInput = document.getElementById('modalDestination');

  function openModal(destinationName = '') {
    if (bookingModal) {
      if (modalDestInput && destinationName) {
        modalDestInput.value = destinationName;
      }
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  function bindBookingModalButtons() {
    const bookingBtns = document.querySelectorAll('.open-booking-modal');
    bookingBtns.forEach(btn => {
      if (!btn.dataset.boundModal) {
        btn.dataset.boundModal = 'true';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const dest = btn.getAttribute('data-dest') || '';
          openModal(dest);
        });
      }
    });
  }
  window.bindBookingModalButtons = bindBookingModalButtons;
  bindBookingModalButtons();

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  // WhatsApp Business Desk Configuration
  const WHATSAPP_NUMBER = '918351917891';

  function openWhatsApp(textMessage) {
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = waUrl;
    } else {
      const win = window.open(waUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = waUrl;
      }
    }
  }

  // 6. Booking Form Submission -> WhatsApp
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName')?.value.trim() || 'Guest';
      const phone = document.getElementById('modalPhone')?.value.trim() || 'N/A';
      const email = document.getElementById('modalEmail')?.value.trim() || '';
      const dest = modalDestInput?.value.trim() || 'General Tour Inquiry';
      
      const travelersSelect = document.getElementById('modalTravelers');
      const travelers = travelersSelect ? travelersSelect.options[travelersSelect.selectedIndex].text : '';
      
      const travelDate = document.getElementById('modalDate')?.value || '';
      const notes = document.getElementById('modalNotes')?.value.trim() || '';

      // Build structured WhatsApp message
      let waMsg = `✨ *NEW TOUR INQUIRY - MORDEN TOURIST* ✨\n\n`;
      waMsg += `👤 *Client Name:* ${name}\n`;
      waMsg += `📞 *Phone / WhatsApp:* ${phone}\n`;
      if (email) waMsg += `📧 *Email Address:* ${email}\n`;
      waMsg += `🏝️ *Selected Destination:* ${dest}\n`;
      if (travelers) waMsg += `👥 *Number of Travelers:* ${travelers}\n`;
      if (travelDate) waMsg += `📅 *Expected Travel Date:* ${travelDate}\n`;
      if (notes) waMsg += `📝 *Special Requests:* ${notes}\n`;
      waMsg += `\n📍 *Office:* SCO 64-65, 2nd Floor, Sector 34-A, Chandigarh\n`;
      waMsg += `🌐 *Sent via:* mordentourist.com`;

      // Log inquiry for Admin Panel tracking
      if (window.InquiriesManager) {
        window.InquiriesManager.log({
          name: name,
          phone: phone,
          email: email,
          destination: dest,
          travelers: travelers,
          travelDate: travelDate,
          notes: notes,
          type: 'booking'
        });
      }

      showToast(`Opening WhatsApp with your booking details for "${dest}"...`);
      openWhatsApp(waMsg);
      closeModal();
      bookingForm.reset();
    });
  }

  // 7. General Contact Form -> WhatsApp
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim() || 'Guest';
      const phone = document.getElementById('contactPhone')?.value.trim() || 'N/A';
      const email = document.getElementById('contactEmail')?.value.trim() || '';
      
      const subjectSelect = document.getElementById('contactSubject');
      const subject = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : 'General Inquiry';
      
      const userMessage = document.getElementById('contactMessage')?.value.trim() || '';

      // Build structured WhatsApp message
      let waMsg = `💬 *NEW CONTACT MESSAGE - MORDEN TOURIST* 💬\n\n`;
      waMsg += `👤 *Sender Name:* ${name}\n`;
      waMsg += `📞 *Mobile Number:* ${phone}\n`;
      if (email) waMsg += `📧 *Email Address:* ${email}\n`;
      waMsg += `🎯 *Destination / Topic:* ${subject}\n`;
      if (userMessage) waMsg += `📝 *Message / Vacation Plan:*\n${userMessage}\n`;
      waMsg += `\n📍 *Office:* SCO 64-65, 2nd Floor, Sector 34-A, Chandigarh\n`;
      waMsg += `🌐 *Sent via:* mordentourist.com`;

      // Log inquiry for Admin Panel tracking
      if (window.InquiriesManager) {
        window.InquiriesManager.log({
          name: name,
          phone: phone,
          email: email,
          destination: subject,
          message: userMessage,
          type: 'contact'
        });
      }

      showToast(`Opening WhatsApp with your message... Thank you, ${name}!`);
      openWhatsApp(waMsg);
      contactForm.reset();
    });
  }

  // 8. Newsletter Form -> WhatsApp
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const email = emailInput.value.trim();

        let waMsg = `📬 *NEWSLETTER & DEALS SUBSCRIPTION - MORDEN TOURIST* 📬\n\n`;
        waMsg += `📧 *Subscriber Email:* ${email}\n`;
        waMsg += `Please send me your latest island travel packages, seasonal discounts, and curated itineraries.\n\n`;
        waMsg += `🌐 *Sent via:* mordentourist.com`;

        showToast(`Subscribed! Opening WhatsApp to connect with our travel desk...`);
        openWhatsApp(waMsg);
        emailInput.value = '';
      }
    });
  }

  // Toast Notification System
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #2DD4BF; font-size: 1.2rem;"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
