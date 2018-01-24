<template>
  <div class="tab-content">
    Alarms
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'alarm',
  props: ['selectedTab'],
  components: {
    draggable
  },
  data () {
    return {
      message: ''
    }
  }
}
</script>
