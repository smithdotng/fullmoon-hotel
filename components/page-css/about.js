// Page styles carried over from the original EJS view
const css = String.raw`
.heritage-badge {
            background: linear-gradient(135deg, #c19b76, #a67c52);
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
        }
        .excellence-item {
            text-align: center;
            padding: 30px 20px;
            margin: 15px 0;
            border-radius: 8px;
            transition: transform 0.3s ease;
        }
        .excellence-item:hover {
            transform: translateY(-5px);
        }
        .excellence-item i {
            font-size: 48px;
            color: #c19b76;
            margin-bottom: 20px;
        }
        .cultural-highlight {
            background: #f8f9fa;
            padding: 40px;
            border-radius: 8px;
            border-left: 4px solid #c19b76;
            margin: 30px 0;
        }
`;
export default css;
