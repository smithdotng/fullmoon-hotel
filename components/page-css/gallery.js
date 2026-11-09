// Page styles carried over from the original EJS view
const css = String.raw`
.gallery-filter {
            margin: 30px 0;
            text-align: center;
        }
        .filter-btn {
            background: transparent;
            border: 2px solid #c19b76;
            color: #c19b76;
            padding: 10px 25px;
            margin: 5px;
            border-radius: 25px;
            transition: all 0.3s ease;
            font-weight: 600;
        }
        .filter-btn:hover, .filter-btn.active {
            background: #c19b76;
            color: white;
            transform: translateY(-2px);
        }
        
        /* Fix for image loading and lightbox */
        .cards figure {
            position: relative;
            overflow: hidden;
        }
        .cards figure a {
            display: block;
            position: relative;
        }
        .cards figure img {
            width: 100%;
            height: auto;
            transition: transform 0.3s ease;
        }
        .cards figure:hover img {
            transform: scale(1.05);
        }
        .cards .btn-clean {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            border: 2px solid white;
            padding: 8px 20px;
            text-decoration: none;
            transition: all 0.3s ease;
            z-index: 2;
        }
        .cards .btn-clean:hover {
            background: white;
            color: #333;
        }
`;
export default css;
