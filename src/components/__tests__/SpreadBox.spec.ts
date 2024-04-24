import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SpreadBox from '../SpreadBox.vue'

describe('SpreadBox', () => {
  it('renders properly', () => {
    const wrapper = mount(SpreadBox, {
      props: { exchange: 'Binance', symbol: 'BTC/USDT', url: 'test.com' },
    })
    expect(wrapper.text()).toContain('Binance')
  })
})
