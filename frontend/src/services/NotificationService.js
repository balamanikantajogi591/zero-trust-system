import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class NotificationService {
    constructor() {
        this.stompClient = null;
        this.callbacks = [];
    }

    connect() {
        const backendUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:8080' 
            : window.location.origin;
        const socket = new SockJS(`${backendUrl}/ws-alerts`);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = null; // Disable debug logging for production

        this.stompClient.connect({}, (frame) => {
            this.stompClient.subscribe('/topic/alerts', (message) => {
                const alert = JSON.parse(message.body);
                this.callbacks.forEach(callback => callback(alert));
            });
        }, (error) => {
            console.error('WebSocket Error: ', error);
            // Reconnect after 5 seconds
            setTimeout(() => this.connect(), 5000);
        });
    }

    onMessageReceived(callback) {
        this.callbacks.push(callback);
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
    }
}

const notificationService = new NotificationService();
export default notificationService;
