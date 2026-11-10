// Page styles carried over from the original EJS view
const css = String.raw`
.detail-card { border-left: 4px solid #007bff; }
        .payment-form-section { background-color: #e8f4f8; border-radius: 8px; }
        .notes-box { background-color: #f8f9fa; border-left: 4px solid #6c757d; }
        .checkin-card { border-left: 4px solid #28a745; }
        .checkout-card { border-left: 4px solid #ffc107; }
        .status-badge { font-size: 0.9rem; }
        .action-buttons .btn { min-width: 120px; }
        .timeline-item { border-left: 2px solid #dee2e6; padding-left: 15px; margin-bottom: 15px; }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-date { font-size: 0.85rem; color: #6c757d; }
        .room-info-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .checkin-info-card { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; }
        .checkout-info-card { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }
`;
export default css;
