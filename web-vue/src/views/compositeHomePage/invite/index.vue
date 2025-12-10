<template>
    <div class="invite-page">
        <div class="fixed-header-wrapper">
            <pc-header />
        </div>

        <div class="invite-container">
            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">Invite Friends</h1>
                    <p class="hero-subtitle">Invite friends to join MSX and earn generous rewards in the future!</p>
                </div>
                <div class="hero-image">
                    <img src="@image/invite.png" alt="Invite Rewards" class="invite-img" />
                </div>
            </div>

            <!-- Invite Link Card -->
            <div class="section-card invite-card">
                <h2 class="card-title">Invite Friends</h2>
                <div class="input-wrapper">
                    <p class="input-label">Connect your wallet to get the referral link</p>
                    <div class="link-input-group">
                        <div class="placeholder-input">--</div>
                        <button class="btn-connect">Connect wallet</button>
                    </div>
                </div>
            </div>

            <!-- Stats Section -->
            <div class="section-text">
                <p>With the Points System coming soon, commission rates for certain accounts will be set to 30% from
                    2025/11/05 00:00 (UTC+8), and invitee commissions will be reset to 0 <span class="link-orange">See
                        announcement >></span></p>
            </div>

            <div class="section-card stats-card">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">Invited Users</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Pending Collection</div>
                        <div class="stat-value">$0</div>
                        <button class="btn-claim-outline">Claim</button>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Spot Commission Rate</div>
                        <div class="stat-value">0%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Contract Rebate Ratio</div>
                        <div class="stat-value">0%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Total Commission</div>
                        <div class="stat-value">$0</div>
                    </div>
                </div>
                <p class="stats-footer-text">The previous day's referral rewards data will be updated before 17:12 UTC+8
                    on the current day</p>
            </div>

            <!-- My Referrals -->
            <div class="referrals-section">
                <div class="referrals-header">
                    <h3><el-icon><info-filled /></el-icon> My Referrals</h3>
                    <div class="search-box">
                        <el-icon>
                            <search />
                        </el-icon>
                        <input type="text" placeholder="Search" />
                    </div>
                </div>

                <div class="referral-table">
                    <div class="table-header">
                        <div class="t-col">Friends List</div>
                        <div class="t-col text-center">Spot fee Rebate Rate</div>
                        <div class="t-col text-center">Futures fee Rebate Rate</div>
                        <div class="t-col text-right">Invitation Time</div>
                    </div>
                    <div class="table-empty">
                        No Referral Records
                    </div>
                </div>
            </div>

        </div>
        <msx-footer />
    </div>
</template>

<script setup>
import PcHeader from "@/components/layout/commonHeader.vue";
import MsxFooter from "@/components/layout/MsxFooter.vue";
import { Search, InfoFilled } from '@element-plus/icons-vue'
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
.invite-page {
    background-color: #000;
    min-height: 100vh;
    color: #fff;
    font-family: 'Inter', sans-serif;
    padding-top: 84px;
    /* Space for fixed header */
}

.fixed-header-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.invite-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

/* Hero Section */
.hero-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;
}

.hero-content {
    max-width: 600px;
}

.hero-title {
    font-size: 56px;
    font-weight: 700;
    color: #82ff28;
    margin-bottom: 16px;
}

.hero-subtitle {
    font-size: 18px;
    color: #ccc;
}

.hero-image img {
    max-width: 300px;
    height: auto;
}

/* Section Cards */
.section-card {
    background: #111;
    border: 1px solid #222;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #ccc;
}

/* Invite Link Input */
.input-label {
    color: #888;
    margin-bottom: 12px;
    font-size: 14px;
}

.link-input-group {
    display: flex;
    gap: 16px;
}

.placeholder-input {
    background: #1a1a1a;
    border-radius: 8px;
    padding: 12px 16px;
    flex: 1;
    color: #666;
    display: flex;
    align-items: center;
}

.btn-connect {
    background: #fff;
    color: #000;
    font-weight: 600;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-connect:hover {
    opacity: 0.9;
}

/* Section Text */
.section-text {
    color: #ffa500;
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.5;
}

.link-orange {
    color: #ffa500;
    text-decoration: underline;
    cursor: pointer;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-label {
    color: #888;
    font-size: 14px;
}

.stat-value {
    font-size: 32px;
    font-weight: 600;
    color: #fff;
}

.btn-claim-outline {
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 6px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    width: fit-content;
    margin-top: 4px;
}

.stats-footer-text {
    color: #666;
    font-size: 12px;
    margin-top: 20px;
}

/* Referrals Section */
.referrals-section {
    margin-top: 60px;
}

.referrals-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.referrals-header h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
}

.search-box {
    background: #1a1a1a;
    border-radius: 20px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    color: #666;
    gap: 8px;
    width: 200px;
}

.search-box input {
    background: transparent;
    border: none;
    color: #fff;
    outline: none;
    width: 100%;
    font-size: 14px;
}

/* Referral Table */
.referral-table {
    background: #111;
    border-radius: 12px;
    overflow: hidden;
}

.table-header {
    display: flex;
    padding: 16px 24px;
    background: #161616;
    color: #666;
    font-size: 12px;
    border-bottom: 1px solid #222;
}

.t-col {
    flex: 1;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.table-empty {
    padding: 60px;
    text-align: center;
    color: #666;
    font-size: 14px;
}
</style>
