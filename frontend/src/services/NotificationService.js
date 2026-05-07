import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class NotificationService {
    constructor() {
        this.stompClient = null;
        this.callbacks = [];
    }

    connect() {
        const backendUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:8080' 
            : window.location.origin;
            
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS(`${backendUrl}/ws-alerts`),
            reconnectDelay: 5000,
            debug: () => {}, // Disable debug logging for production
            onConnect: () => {
                this.stompClient.subscribe('/topic/alerts', (message) => {
                    if (message.body) {
                        const alert = JSON.parse(message.body);
                        this.callbacks.forEach(callback => callback(alert));
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            }
        });

        this.stompClient.activate();
    }

    onMessageReceived(callback) {
        this.callbacks.push(callback);
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
    }
}

const notificationService = new NotificationService();
export default notificationService;
