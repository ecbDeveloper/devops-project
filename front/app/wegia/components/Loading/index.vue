<template>
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
</template>
  
<style scoped>
.loading-container {
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    height: fit-content;
    justify-content: center;
    padding: 24px;
}
  
.spinner {
    animation: spin 1s linear infinite;
    border: 5px solid rgba(0, 0, 0, 0.2);
    border-top-color: #007bff;
    border-radius: 50%;
    height: 50px;
    width: 50px;
}
  
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
  