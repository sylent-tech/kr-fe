<template>
  <v-card :loading="loading" variant="tonal">
    <template v-slot:title>
      {{ exchange }} <v-chip variant="flat">{{ symbol }}</v-chip>
    </template>

    <template v-slot:subtitle>
      <p v-if="loading">Connecting to {{ exchange }}...</p>
      <p v-else-if="spreadData !== null">Spread</p>
    </template>

    <template v-slot:text>
      <div class="tops-header">
        <div>
          <div>Price</div>
          <div>Quantity</div>
        </div>
      </div>

      <div class="tops">
        <div v-for="top in topThreeAsks" v-bind:key="top.price">
          <div>{{ top.price }}</div>
          <div>{{ top.quantity }}</div>
        </div>
      </div>

      <div class="spread" v-if="spreadData !== null">{{ percentSpread }}%</div>

      <div class="tops bottom">
        <div v-for="top in topThreeBids" v-bind:key="top.price">
          <div>{{ top.price }}</div>
          <div>{{ top.quantity }}</div>
        </div>
      </div>
    </template>

    <v-card-actions>
      <v-btn @click="connect()" variant="tonal" v-if="!connected" size="small">
        Connect
      </v-btn>
      <v-btn @click="disconnect()" variant="tonal" v-else size="small">
        Disconnect
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import type { Asks, Bids, SpreadData } from '@/types'
import { calculateSpread, calculateTops } from '@/helpers/spread'

interface Props {
  exchange: string
  symbol: string
  url: string
}

const { exchange, symbol, url } = defineProps<Props>()

const connected = ref<boolean>(false)
const loading = ref<boolean>(false)
const midPrice = ref<number>(0)
const percentSpread = ref<number>(0)
const spreadData = ref<number | null>(null)
const topThreeAsks = ref<Asks>([])
const topThreeBids = ref<Bids>([])

const websocket = useWebSocket<SpreadData>({
  eventName: exchange.toLowerCase(),
  url,
  onConnect: () => {
    console.info(`Connected to ${exchange} WebSocket`)
    loading.value = false
  },
  onConnectError: (error) => {
    console.info(`Connection error from ${exchange} WebSocket`)
    console.error(error)
    loading.value = false
  },
  onDisconnect: () => {
    console.info(`Disconnected from ${exchange} WebSocket`)
    loading.value = false
  },
  onMessage: (data) => {
    const spread = calculateSpread(data.bids, data.asks)
    spreadData.value = spread

    topThreeBids.value = calculateTops(data.bids)
    topThreeAsks.value = calculateTops(data.asks)

    const bestBid = topThreeBids.value[0]
    const bestAsk = topThreeAsks.value[0]

    midPrice.value = bestBid.price + bestAsk.price / 2
    percentSpread.value =
      (100 * (bestAsk.price - bestBid.price)) / midPrice.value
    topThreeAsks.value.reverse()
  },
})

watch(websocket.connected, (newStatus) => {
  connected.value = newStatus
})

const connect = () => {
  loading.value = true
  websocket.connect()
}
const disconnect = () => {
  loading.value = true
  websocket.disconnect()
}
</script>

<style scoped>
.tops-header,
.tops {
  margin-bottom: 0.75rem;
}
.tops.bottom {
  margin-bottom: 0;
  margin-top: 0.75rem;
}
.tops-header > div,
.tops > div {
  display: flex;
  justify-content: space-between;
}
.tops > div > div {
  color: red;
}
.tops.bottom > div > div {
  color: green;
}
.spread {
  display: flex;
  justify-content: center;
}
</style>
