<template>
    <div class="affiliate-page">
        <div class="fixed-header-wrapper">
            <pc-header />
        </div>

        <div class="affiliate-content">

            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-overlay"></div>
                <div class="hero-text">
                    <h1 class="hero-title">Make Influence More Valuable</h1>
                    <p class="hero-subtitle">GLOBEX Affiliate Program, helping you open the path to wealth in the new
                        era
                        of stock tokens</p>
                    <button class="btn-join">Join Affiliate Program ></button>
                </div>
            </div>

            <!-- Rights Section -->
            <div class="section-container rights-section">
                <div class="section-header-row">
                    <h2 class="section-title">Exclusive Rights · One Step Ahead</h2>
                    <img src="@/assets/TOP1.png" alt="TOP1" class="top1-img" />
                </div>
                <p class="section-desc">Exclusive RWA US stock token rebates, multi-level tiered sharing, and platform
                    resource support</p>

                <div class="cards-grid">
                    <!-- Card 1 -->
                    <div class="feature-card">
                        <div class="card-icon">
                            <el-icon>
                                <TrendCharts />
                            </el-icon>
                        </div>
                        <h3 class="card-title">Revenue Rights</h3>
                        <p class="card-desc">Highly competitive (up to 30%) commission sharing, exclusive rebates and
                            rewards</p>
                    </div>

                    <!-- Card 2 -->
                    <div class="feature-card">
                        <div class="card-icon">
                            <el-icon>
                                <School />
                            </el-icon>
                        </div>
                        <h3 class="card-title">Resource Support</h3>
                        <p class="card-desc">Channel resource linkage, advertising support and activity co-creation,
                            rhythm and holiday linkage</p>
                    </div>

                    <!-- Card 3 -->
                    <div class="feature-card">
                        <div class="card-icon">
                            <el-icon>
                                <Document />
                            </el-icon>
                        </div>
                        <h3 class="card-title">Technical Support</h3>
                        <p class="card-desc">Exclusive event landing pages & permission configuration, data dashboards
                            and conversion replay support</p>
                    </div>
                </div>
            </div>

            <!-- Process Section -->
            <div class="section-container process-section">
                <h2 class="section-title text-center">Become an GLOBEX Agent</h2>
                <p class="section-desc text-center">Build trusted trading value with us and start your long-term
                    earnings journey</p>

                <div class="process-steps">
                    <div class="step-item">
                        <div class="step-circle">1</div>
                        <h4 class="step-title">Submit Application</h4>
                        <p class="step-desc">Simple online submission, quick review, exclusive account docking,
                            exclusive rights, material support, ready to promote.</p>
                    </div>
                    <div class="step-line"></div>
                    <div class="step-item">
                        <div class="step-circle">2</div>
                        <h4 class="step-title">Get Referral Code</h4>
                        <p class="step-desc">Generate exclusive promotion code in GLOBEX backend, promote via social
                            media,
                            portals and communities, system auto-records data.</p>
                    </div>
                    <div class="step-line"></div>
                    <div class="step-item">
                        <div class="step-circle">3</div>
                        <h4 class="step-title">Invite & Earn</h4>
                        <p class="step-desc">Flexible monthly/weekly settlement, uncapped earnings, activity support,
                            one-stop marketing resources.</p>
                    </div>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="section-container cta-section-wrapper">
                <div class="cta-card">
                    <div class="cta-text">
                        <h2>Become an GLOBEX Agent Now</h2>
                        <p>Start your journey of unlimited earnings</p>
                    </div>
                    <button class="btn-join-white">Join Affiliate Program ></button>
                </div>
            </div>

        </div>
        <globex-footer />
    </div>
</template>

<script setup>
import PcHeader from "@/components/layout/commonHeader.vue";
import GlobexFooter from "@/components/layout/MsxFooter.vue";
import { TrendCharts, School, Document } from '@element-plus/icons-vue'
</script>

<style>
/* Reset */
body,
html {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #000;
}
</style>

<style scoped>
.affiliate-page {
    background-color: #000;
    min-height: 100vh;
    color: #fff;
    font-family: 'Inter', sans-serif;
    padding-top: 84px;
    /* Fixed Header Space */
}

.fixed-header-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.affiliate-content {
    width: 100%;
}

/* Hero Section */
.hero-section {
    position: relative;
    height: 700px;
    background: url('@/assets/background_invite.png') no-repeat center center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* Darken overlay if needed, adjusting based on image brightness */
}

.hero-text {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 0 20px;
}

.hero-title {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #fff;
    /* White title based on image */
}

.hero-subtitle {
    font-size: 18px;
    color: #ccc;
    margin-bottom: 40px;
}

.btn-join {
    background: #82ff28;
    color: #000;
    font-weight: 700;
    padding: 14px 40px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
}

.btn-join:hover {
    transform: scale(1.05);
}

/* Section Common */
.section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 20px;
}

.section-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #fff;
}

.section-desc {
    color: #888;
    font-size: 16px;
    margin-bottom: 50px;
}

.text-center {
    text-align: center;
}

/* Rights Section */
.section-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    /* Align bottom/baseline */
    margin-bottom: 12px;
}

.top1-img {
    height: 40px;
    /* Adjust based on asset */
    opacity: 0.8;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.feature-card {
    background: #111;
    border: 1px solid #222;
    border-radius: 16px;
    padding: 40px 30px;
    transition: border-color 0.3s;
}

.feature-card:hover {
    border-color: #333;
}

.card-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 24px;
    font-size: 32px;
    color: #fff;
}

.card-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #fff;
}

.card-desc {
    color: #888;
    font-size: 14px;
    line-height: 1.6;
}

/* Process Section */
.process-section {
    background: #000;
    /* Assuming black flow but could be distinct */
}

.process-steps {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background: #0a0a0a;
    padding: 60px 40px;
    border-radius: 16px;
    border: 1px solid #1a1a1a;
}

.step-item {
    flex: 1;
    text-align: center;
    padding: 0 20px;
}

.step-circle {
    width: 40px;
    height: 40px;
    background: #fff;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin: 0 auto 24px auto;
    font-size: 18px;
}

.step-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #fff;
}

.step-desc {
    font-size: 13px;
    color: #888;
    line-height: 1.6;
}

.step-line {
    flex: 0 0 100px;
    height: 1px;
    background: #333;
    margin-top: 20px;
    /* Align with circle center aprox */
}

/* Stats Section */
.stats-row {
    display: flex;
    justify-content: space-around;
    margin-top: 60px;
}

.stat-box {
    text-align: center;
}

.stat-num {
    font-size: 48px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
}

.stat-label {
    color: #888;
    font-size: 14px;
}

/* CTA Section */
.cta-section-wrapper {
    padding-bottom: 100px;
}

.cta-card {
    background: #82ff28;
    border-radius: 24px;
    padding: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cta-text h2 {
    color: #000;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 12px;
}

.cta-text p {
    color: #000;
    font-size: 16px;
    font-weight: 500;
}

.btn-join-white {
    background: #fff;
    color: #000;
    font-weight: 700;
    padding: 16px 32px;
    border-radius: 50px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-join-white:hover {
    opacity: 0.9;
}
</style>
