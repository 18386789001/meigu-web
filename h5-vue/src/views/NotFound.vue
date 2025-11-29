<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">{{ $t('notFound.title') }}</h1>
        <p class="error-desc">{{ $t('notFound.description') }}</p>

        <div class="error-actions">
          <button class="btn-primary" @click="goHome">
            {{ $t('notFound.goHome') }}
          </button>
          <button class="btn-secondary" @click="goBack">
            {{ $t('notFound.goBack') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.container {
  @include container;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  
  .error-code {
    font-size: 120px;
    font-weight: var(--font-bold);
    color: var(--primary-color);
    line-height: 1;
    margin-bottom: var(--spacing-lg);
  }
  
  .error-title {
    font-size: var(--font-3xl);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
  
  .error-desc {
    font-size: var(--font-lg);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-2xl);
    line-height: var(--line-height-relaxed);
  }
  
  .error-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
    
    .btn-primary,
    .btn-secondary {
      @include button('primary');
      padding: var(--spacing-md) var(--spacing-xl);
    }
    
    .btn-secondary {
      @include button('outline');
    }
  }
}

@include mobile {
  .not-found-content {
    padding: var(--spacing-lg);
    
    .error-code {
      font-size: 80px;
    }
    
    .error-actions {
      flex-direction: column;
      align-items: center;
      
      .btn-primary,
      .btn-secondary {
        width: 100%;
        max-width: 280px;
      }
    }
  }
}
</style>
