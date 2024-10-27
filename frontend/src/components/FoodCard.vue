<template>
  <article class="chicken-rice-container">
    <img 
      loading="lazy" 
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/75afd51dbadfecc60f5e997e20a801a96eff326363ea7691f8f969154cd654f0?placeholderIfAbsent=true&apiKey=3d645b295fdd4c58b9ee9c63fae10398" 
      alt="Hainanese Chicken Rice dish presentation" 
      class="dish-image" 
    />
    <h2 class="dish-title">Hainanese Chicken Rice</h2>
  </article>
</template>

<style scoped>
.chicken-rice-container {
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0;
  aspect-ratio: 1.064;
  flex-grow: 1;
  color: #000;
  text-align: center;
  letter-spacing: -0.64px;
  padding: 196px 57px 33px;
  font: 400 16px "DM Serif Text", sans-serif;
}

.dish-image {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.dish-title {
  position: relative;
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
}

@media (max-width: 991px) {
  .chicken-rice-container {
    margin-top: 21px;
    padding: 100px 20px 0;
  }
}
</style>
