// Custom JavaScript for Daraz Clone

// Banner Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    // You can implement a banner slider here if needed
    const dots = document.querySelectorAll('.dot');
    
    let currentDot = 0;
    
    function updateActiveDot() {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentDot].classList.add('active');
      currentDot = (currentDot + 1) % dots.length;
    }
    
    // Change active dot every 3 seconds
    setInterval(updateActiveDot, 2500);
  });