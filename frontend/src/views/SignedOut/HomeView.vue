<script setup>
import { useAuth } from 'vue-clerk'
import { RouterLink } from 'vue-router'

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
</style>
