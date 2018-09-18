<template>
  <div class="app-container">
    <p class="warn-content">
      {{ $t('guide.description') }}
      <a href="http://www.eoutech.com/" target="_blank">  {{ $t('guide.more') }}.
      </a>
    </p>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">{{ $t('guide.button') }}</el-button>
  </div>
</template>

<script>
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
// import steps from './defineSteps'

// const steps = [
//    {
//        element: '.hamburger-container',
//        popover: {
//            title: this.$t('route.dashboard'),
//            description: 'Open && Close sidebar',
//            position: 'bottom'
//        }
//    },
//    {
//        element: '.breadcrumb-container',
//        popover: {
//            title: 'Breadcrumb',
//            description: 'Indicate the current page location',
//            position: 'bottom'
//        }
//    },
//    {
//        element: '.screenfull',
//        popover: {
//            title: 'Screenfull',
//            description: 'Bring the page into fullscreen',
//            position: 'left'
//        }
//    },
//    {
//        element: '.international-icon',
//        popover: {
//            title: 'Switch language',
//            description: 'Switch the system language',
//            position: 'left'
//        }
//    },
//    {
//        element: '.theme-switch',
//        popover: {
//            title: 'Theme Switch',
//            description: 'Custom switch system theme',
//            position: 'left'
//        }
//    },
//    {
//        element: '.tags-view-container',
//        popover: {
//            title: 'Tags view',
//            description: 'The history of the page you visited',
//            position: 'bottom'
//        }
//    }
// ]

export default {
  name: 'Guide',
  data() {
    return {
      driver: null,
      steps: [
        {
          element: '.hamburger-container',
          popover: {
            title: this.$t('guide.hamburger'),
            description: this.$t('guide.hamburger_desc'),
            position: 'bottom'
          }
        },
        {
          element: '.breadcrumb-container',
          popover: {
            title: this.$t('guide.breadcrumb'),
            description: this.$t('guide.breadcrumb_desc'),
            position: 'bottom'
          }
        },
        {
          element: '.screenfull',
          popover: {
            title: this.$t('guide.screenfull'),
            description: this.$t('guide.screenfull_desc'),
            position: 'left'
          }
        },
        {
          element: '.size-icon',
          popover: {
            title: this.$t('guide.size'),
            description: this.$t('guide.size_desc'),
            position: 'left'
          }
        },
        {
          element: '.international-icon',
          popover: {
            title: this.$t('guide.lang'),
            description: this.$t('guide.lang_desc'),
            position: 'left'
          }
        },
        {
          element: '.theme-switch',
          popover: {
            title: this.$t('guide.theme'),
            description: this.$t('guide.theme_desc'),
            position: 'left'
          }
        },
        {
          element: '.user-avatar',
          popover: {
            title: this.$t('guide.user'),
            description: this.$t('guide.user_desc'),
            position: 'left'
          }
        },
        {
          element: '.tags-view-container',
          popover: {
            title: this.$t('guide.tags'),
            description: this.$t('guide.tags_desc'),
            position: 'bottom'
          }
        }
      ]
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(this.steps)
      this.driver.start()
    }
  }
}
</script>
