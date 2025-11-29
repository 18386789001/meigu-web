import { defineStore } from 'pinia'
import { SET_KEFU } from '@/store/types.store'
import { _customer } from '@/service/user.api';



export const useHomesStore = defineStore('homes', {
    // state 持久化
    persist: true,
    state: () => ('homes', {
        // 使用新的第三方客服链接
        kefu_url: "https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab"
    }),

    actions: {
        async [SET_KEFU]() { //获取客服
            // 直接使用新的客服链接，不再从后端获取
            // 如果后端有返回客服链接，优先使用后端的配置
            try {
                const data = await _customer().catch(err => null)
                if (data && data.customer_service_url) {
                    console.log("使用后端返回的客服链接:", data.customer_service_url)
                    this.kefu_url = data.customer_service_url
                } else {
                    // 使用默认的新客服链接
                    console.log("使用默认客服链接")
                    this.kefu_url = "https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab"
                }
            } catch (error) {
                console.error("获取客服链接失败，使用默认链接", error)
                this.kefu_url = "https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab"
            }
        },
    },
})