<template>
  <div id="app">
    <landing-page></landing-page>
  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage'
  const Rx = require('rxjs/Rx')
  const moment = require('moment')
  const notifier = require('electron').remote.require('electron-notifications')
  const source = Rx.Observable.timer(1000, 60 * 1000)
  const alerts = ['11:45', '8:35', '8:37', '9:00', '10:00', '11:00']
  source.subscribe(val => {
    console.log('schedule timer: ', val)
    alerts.forEach((a, i) => {
      console.log('check time:', a, i)
      if (moment(a, 'H:mm').isBefore(Date.now())) {
        alerts.splice(i, 1)
        console.log('show notification:', a, i)
        const notification = notifier.notify('Calendar', {
          message: 'Have a rest',
          icon: 'https://image.flaticon.com/icons/svg/691/691758.svg',
          buttons: ['Dismiss'],
          duration: 300000
        })
        notification.on('buttonClicked', () => {
          notification.close()
        })
      }
    })
  })

  export default {
    name: 'backlog',
    components: {
      LandingPage
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  @import url('~animate.css');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, sans-serif;
    height: 100vh;
    background-color: #ffffff;
    padding: 10px 0;
  }
</style>
