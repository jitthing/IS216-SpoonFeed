<script setup>
import { useAuth } from 'vue-clerk'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
const { isSignedIn } = useAuth()

const features = [
  {
    title: 'SEARCH FOR DIFFERENT RECIPES',
    description: 'Search recipes based on ingredients or categories!'
  },
  {
    title: 'CREATE YOUR OWN RECIPES',
    description: 'Create your own recipes and post them on the community page!'
  },
  {
    title: 'PLAN YOUR MEALS WEEKLY',
    description: 'Pick recipes that you want to cook for the week and add them to the meal planner!'
  },
  {
    title: 'KEEP YOUR MEAL HISTORY!',
    description: 'Keep track of all the meals you have eaten!'
  },
  {
    title: 'TRACK YOUR MACRO-NUTRIENTS',
    description:
      'Better understand what you are eating and the amount of macro-nutrients in each recipe!'
  }
]

// Double the features array for seamless scrolling
const scrollingFeatures = [...features, ...features]

// Add this with your other data
const reviews = [
  {
    id: 1,
    name: 'Ee Herng Tan',
    role: 'Home Cook / Gym Goer',
    image: '/src/assets/avatar1.jpeg', // You'll add actual images later
    content:
      'Using Spoonfeed has made meal planning so much easier! I am able to track my macros and plan my meals for the week with so much ease!',
    rating: 5
  },
  {
    id: 2,
    name: 'Mohd Anafiya',
    role: 'Social Media Food Enthusiast',
    image: '/src/assets/avatar2.jpeg',
    content: 'Seeing the recipes by other cooks brings me so much joy! So inspiring!',
    rating: 5
  },
  {
    id: 3,
    name: 'Jang Jisun',
    role: 'Busy Parent',
    image: '/src/assets/avatar3.jpeg',
    content:
      'Being a busy parent, I find it hard to plan meals for my family. Spoonfeed has given me so many new ideas and lets my family try out new recipes!',
    rating: 5
  }
]

const currentReview = ref(0)

const nextReview = () => {
  currentReview.value = (currentReview.value + 1) % reviews.length
}

const prevReview = () => {
  currentReview.value = (currentReview.value - 1 + reviews.length) % reviews.length
}

const goToReview = (index) => {
  currentReview.value = index
}
</script>

<template>
  <div v-if="!isSignedIn" class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>SpoonFeed.</h1>
        <p class="hero-subtitle">
          Your personal kitchen companion for meal planning and recipe management
        </p>
        <div class="cta-buttons">
          <RouterLink to="/sign-up" class="btn-primary">Get Started</RouterLink>
          <RouterLink to="/sign-in" class="btn-secondary">Welcome back</RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Scroll Section -->
    <section class="features">
      <h2>Everything you need to manage your meals</h2>
      <div class="scroll-container">
        <div class="scroll-content">
          <div class="card-container" v-for="(feature, index) in scrollingFeatures" :key="index">
            <div class="card">
              <div class="card-icon">
                <!-- Add icons here if needed -->
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="social-proof">
      <h2>Trusted by home cooks everywhere</h2>
      <div class="stats">
        <div class="stat-item">
          <h3>10k+</h3>
          <p>Active Users</p>
        </div>
        <div class="stat-item">
          <h3>50k+</h3>
          <p>Recipes Shared</p>
        </div>
        <div class="stat-item">
          <h3>4.9/5</h3>
          <p>User Rating</p>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section class="reviews">
      <h2>What Our Users Say</h2>
      <div class="reviews-carousel">
        <button class="carousel-btn prev" @click="prevReview" aria-label="Previous review">
          ‹
        </button>

        <div class="reviews-container">
          <TransitionGroup name="slide">
            <div
              v-for="(review, index) in reviews"
              :key="review.id"
              v-show="index === currentReview"
              class="review-card"
            >
              <div class="review-image">
                <img :src="review.image" :alt="review.name" />
              </div>
              <div class="review-content">
                <div class="stars">
                  <span v-for="n in review.rating" :key="n" class="star">★</span>
                </div>
                <p class="review-text">{{ review.content }}</p>
                <div class="reviewer-info">
                  <h4>{{ review.name }}</h4>
                  <p>{{ review.role }}</p>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <button class="carousel-btn next" @click="nextReview" aria-label="Next review">›</button>
      </div>

      <div class="review-dots">
        <button
          v-for="(_, index) in reviews"
          :key="index"
          class="dot"
          :class="{ active: index === currentReview }"
          @click="goToReview(index)"
          :aria-label="`Go to review ${index + 1}`"
        ></button>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bottom-cta">
      <h2>Ready to start your cooking journey?</h2>
      <p>Join thousands of happy cooks who have transformed their meal planning.</p>
      <RouterLink to="/sign-up" class="btn-primary">Get Spoon Fed Today</RouterLink>
    </section>
  </div>
</template>

<style scoped>
/* Base styles */
.landing-page {
  color: #2c3e50;
}

/* Hero Section */
.hero {
  min-height: 80vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('/src/assets/background.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.hero-content {
  max-width: 800px;
}

.hero h1 {
  font-size: 4rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 2rem;
}

/* Buttons */
.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.2s;
}

.btn-primary {
  background-color: #acbaa1;
  color: white;
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

/* Features Section */
.features {
  text-align: center;
  padding: 4rem 0;
  background-color: #f8f9fa;
  overflow: hidden; /* Important for containing the scrolling content */
}

.scroll-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 2rem 0;
}

.scroll-content {
  display: flex;
  animation: scroll 30s linear infinite;
  gap: 2rem;
  padding: 1rem;
}

.card-container {
  flex: 0 0 300px; /* Fixed width for each card */
}

.card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.card p {
  color: #666;
  line-height: 1.5;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-300px * 4 - 8rem)); /* Adjust based on card width and gap */
  }
}

/* Pause animation on hover */
.scroll-container:hover .scroll-content {
  animation-play-state: paused;
}

/* Make sure the animation is smooth */
.scroll-content {
  will-change: transform;
}

/* Social Proof Section */
.social-proof {
  padding: 4rem 2rem;
  text-align: center;
  background-color: white;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 2rem;
}

.stat-item h3 {
  font-size: 2.5rem;
  color: #acbaa1;
}

/* Bottom CTA */
.bottom-cta {
  padding: 4rem 2rem;
  text-align: center;
  background-color: #f8f9fa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 3rem;
  }

  .stats {
    flex-direction: column;
    gap: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .card-container {
    flex: 0 0 250px; /* Smaller cards on mobile */
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-250px * 4 - 8rem));
    }
  }
}

/* Reviews Section */
.reviews {
  padding: 6rem 2rem;
  background-color: white;
  text-align: center;
}

.reviews h2 {
  margin-bottom: 3rem;
}

.reviews-carousel {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reviews-container {
  flex: 1;
  position: relative;
  height: 400px;
  overflow: hidden;
  perspective: 1000px; /* Adds depth to the transition */
}

.review-card {
  position: absolute;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  backface-visibility: hidden; /* Prevents flickering during transition */
  transform-style: preserve-3d;
}

.review-image img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #acbaa1;
}

.review-content {
  max-width: 600px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.review-card:hover .review-content {
  transform: translateY(-5px);
}

.stars {
  color: #ffd700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.review-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.reviewer-info h4 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.reviewer-info p {
  color: #718096;
}

.carousel-btn {
  background: none;
  border: none;
  font-size: 3rem;
  color: #acbaa1;
  cursor: pointer;
  padding: 1rem;
  transition: color 0.3s ease;
}

.carousel-btn:hover {
  color: #8c9882;
}

.review-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: #e2e8f0;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #acbaa1;
}

/* Update the transition styles */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
