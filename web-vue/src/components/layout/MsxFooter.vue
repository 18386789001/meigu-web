<template>
  <footer class="msx-footer">
    <div class="footer-content-wrapper">
      <div class="footer-left">
        <div class="footer-brand">
          <img src="/image/logo.png" alt="GLOBEX Logo" class="footer-logo" />
          <span class="footer-brand-text">GLOBEX</span>
        </div>
        <p class="footer-slogan">Innovation Drive Growth<br>Do our best to help users achieve wealth growth</p>
        <div class="footer-contact-info">
          <p class="contact-label">Partnership Application</p>
          <a href="mailto:info@msx.com" class="contact-email">info@msx.com</a>
        </div>
      </div>
      <div class="footer-links-group">
        <div class="footer-column">
          <h3>Community</h3>
          <ul>
            <li><a href="#">MSX Official</a></li>
            <li><a href="#">MSX CN</a></li>
            <li><a href="#">Telegram Global</a></li>
            <li><a href="#">Telegram CN</a></li>
            <li><a href="#">Discord</a></li>
            <li><a href="#">Community Voting</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>About MSX</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Notices</a></li>
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Protection</a></li>
            <li><a href="#">White paper</a></li>
            <li><a href="#">Affiliate Program</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Other</h3>
          <ul>
            <li><a href="#">AML Statement</a></li>
            <li><a href="#">Disclaimer</a></li>
            <li><a href="#">Law Enforcement Requests</a></li>
            <li><a href="#">Proof of Reserves</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 MSX All rights reserved</p>
    </div>
  </footer>
</template>

<script setup>
// No logic needed for static footer
</script>

<style scoped>
.msx-footer {
  width: 100%;
  padding: 80px 0 0;
  background: #000;
  border-top: 1px solid #000;
  font-family: 'Inter', sans-serif;
}

.footer-content-wrapper {
  max-width: 100%;
  padding: 60px 80px 60px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 60px;
  border-top: 1px solid #333;
}

.footer-left {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: -30px; /* Matching home.vue negative gap */
  margin-bottom: 24px;
}

.footer-brand .footer-logo {
  height: 70px;
  width: auto;
  object-fit: contain;
}

.footer-brand .footer-brand-text {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
}

.footer-slogan {
  font-size: 14px;
  color: #fff;
  line-height: 1.6;
  margin-bottom: 40px;
}

.footer-contact-info {
  margin-top: auto;
  padding-top: 20px;
}

.footer-contact-info .contact-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.footer-contact-info .contact-email {
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-contact-info .contact-email:hover {
  color: #bcff2f;
}

.footer-links-group {
  display: flex;
  gap: 120px;
}

.footer-column h3 {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 28px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 20px;
}

.footer-column ul li a {
  font-size: 13px;
  color: #888;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column ul li a:hover {
  color: #bcff2f;
}

.footer-bottom {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px 80px 24px;
  background: #000;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  text-align: center;
}

.footer-bottom p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* Responsive Styles from home.vue */
@media (max-width: 1024px) {
  .footer-content-wrapper {
    flex-direction: column;
    gap: 40px;
  }
  .footer-links-group {
    width: 100%;
    justify-content: space-between;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .footer-links-group {
    flex-direction: column;
    gap: 40px;
  }
  .footer-brand {
    justify-content: center;
  }
  .footer-left {
    text-align: center;
    max-width: 100%;
  }
}
</style>
