SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Cơ sở dữ liệu: `chethai_db`
--

--
-- Đang đổ dữ liệu cho bảng `products`
--
DELETE FROM `products`;

INSERT INTO
    `products` (
        `id`,
        `created_at`,
        `updated_at`,
        `description`,
        `image`,
        `name`,
        `price`,
        `stock`,
        `category_id`,
        `details`,
        `discount`,
        `images`,
        `is_featured`,
        `is_new`,
        `meta_keywords`,
        `origin`,
        `original_price`,
        `processing_method`,
        `short_description`,
        `slug`,
        `weight`
    )
VALUES (
        1,
        '2024-03-19 17:00:00.000000',
        '2026-01-28 15:10:55.761723',
        'Trà Shan Tuyết được hái từ những cây trà cổ thụ hàng trăm năm tuổi trên đỉnh núi cao, mang hương vị đặc trưng của vùng đất Thái Nguyên.',
        '683ad3ca207fd4.15661936_bac_tra_shan-tuyet.jpg',
        'Trà Shan Tuyết Cổ Thụ',
        350000.00,
        109,
        '1',
        '*Thành phần\r\nBúp trà Shan Tuyết\r\nNước tinh khiết\r\n---*Công dụng\r\nChứa nhiều chất chống oxy hóa\r\nTăng cường sức đề kháng\r\nGiúp tỉnh táo, tập trung\r\nHỗ trợ tiêu hóa\r\n---*Cách sử dụng\r\nPha 5g trà với 200ml nước sôi 90-95°C\r\nỦ trong 3-5 phút\r\nCó thể pha được ',
        '22',
        '[\"683ad3ca207fd4.15661936_bac_tra_shan-tuyet.jpg\", \"sp2.webp\", \"sp3.webp\", \"sp4.webp\"]',
        b'1',
        b'1',
        'trà shan tuyết, trà cổ thụ, trà thái nguyên, trà đặc sản, trà cao cấp',
        'Thái Nguyên',
        '450000',
        'Thủ công',
        'Trà Shan Tuyết được hái từ những cây trà cổ thụ hàng trăm năm tuổi',
        'tra-shan-tuyet-co-thu',
        '100g'
    ),
    (
        2,
        '2024-03-14 17:00:00.000000',
        '2026-01-28 15:10:55.761836',
        'Trà Oolong sữa với hương vị béo ngậy, thơm ngon đặc trưng. Sản phẩm được chế biến theo công thức độc quyền của chúng tôi.',
        '683ad3bcdeb6d0.27973287_tra-o-long-3.jpg',
        'Trà Oolong Sữa',
        280000.00,
        111,
        '2',
        '*Thành phần\r\nTrà Oolong\r\nHương sữa tự nhiên\r\n---\r\n*Công dụng\r\nGiảm cân hiệu quả\r\nTăng cường trao đổi chất\r\nCải thiện làn da\r\nHỗ trợ tiêu hóa\r\n---\r\n*Cách sử dụng\r\nPha 5g trà với 200ml nước sôi 85-90°C\r\nỦ trong 2-3 phút\r\nCó thể pha được 2-3 lần',
        '20',
        '[\"683ad3bcdeb6d0.27973287_tra-o-long-3.jpg\", \"sp1.webp\", \"sp4.webp\", \"sp5.webp\"]',
        b'1',
        b'0',
        'trà oolong sữa, trà sữa đài loan, trà oolong, trà sữa, trà thơm',
        'Đài Loan',
        '350000',
        'Công nghệ hiện đại',
        'Trà Oolong sữa với hương vị béo ngậy, thơm ngon đặc trưng',
        'tra-oolong-sua',
        '100g'
    ),
    (
        3,
        '2024-03-09 17:00:00.000000',
        '2025-10-15 06:00:31.000000',
        'Trà xanh Thái Nguyên thượng hạng, được hái từ những búp trà non tơ, mang hương vị tinh khiết, thanh mát.',
        '683ad3d5d04031.07835173_tra-xanh.jpg',
        'Trà Xanh Thái Nguyên',
        250000.00,
        118,
        '3',
        '*Thành phần\r\nBúp trà xanh\r\nNước tinh khiết\r\n---*Công dụng\r\nChống oxy hóa\r\nTăng cường miễn dịch\r\nGiảm căng thẳng\r\nHỗ trợ tim mạch\r\n---*Cách sử dụng\r\nPha 5g trà với 200ml nước sôi 80-85°C\r\nỦ trong 2-3 phút\r\nCó thể pha được 2-3 lần',
        '17',
        '[\"683ad3d5d04031.07835173_tra-xanh.jpg\", \"sp5.webp\", \"sp1.webp\", \"sp8.webp\"]',
        b'0',
        b'1',
        'trà xanh, trà thái nguyên, trà búp, trà ngon, trà truyền thống',
        'Thái Nguyên',
        '300000',
        'Truyền thống',
        'Trà xanh Thái Nguyên thượng hạng, được hái từ những búp trà non tơ',
        'tra-xanh-thai-nguyen',
        '100g'
    ),
    (
        4,
        '2024-03-04 17:00:00.000000',
        '2026-01-28 04:07:54.558849',
        'Trà hồng Đài Loan với hương vị ngọt ngào, thơm ngon. Sản phẩm được nhập khẩu trực tiếp từ Đài Loan.',
        '683ad3df7e6286.18050944_hong-dai-kho.jpg',
        'Trà Hồng Đài Loan',
        320000.00,
        148,
        '4',
        '*Thành phần\r\nTrà hồng\r\nHương hoa tự nhiên\r\n---*Công dụng\r\nTăng cường sức khỏe\r\nCải thiện tâm trạng\r\nHỗ trợ giấc ngủ\r\nTăng cường miễn dịch\r\n---*Cách sử dụng\r\nPha 5g trà với 200ml nước sôi 90-95°C\r\nỦ trong 3-5 phút\r\nCó thể pha được 3-4 lần',
        '20',
        '[\"683ad3df7e6286.18050944_hong-dai-kho.jpg\", \"sp5.webp\", \"sp7.webp\", \"sp1.webp\"]',
        b'1',
        b'0',
        'trà hồng, trà đài loan, trà nhập khẩu, trà hoa, trà thơm',
        'Đài Loan',
        '400000',
        'Công nghệ hiện đại',
        'Trà hồng Đài Loan với hương vị ngọt ngào, thơm ngon',
        'tra-hong-dai-loan',
        '100g'
    ),
    (
        5,
        '2024-03-14 17:00:00.000000',
        '2026-01-28 04:23:57.680412',
        'Bạch trà là loại trà quý hiếm được thu hái từ những búp trà non nhất, phơi sương và chế biến theo phương pháp truyền thống. Sở hữu hương thơm tinh tế, vị ngọt thanh khiết cùng màu nước vàng nhạt đặc trưng.',
        '683ad3aea9adc1.63735988_bach-tra.jpg',
        'Bạch Trà',
        450000.00,
        220,
        '4',
        '*Thành phần\nBúp trà trắng nguyên chất\n---\n*Công dụng\nChống oxy hóa mạnh mẽ\nTăng cường hệ miễn dịch\nLàm đẹp da\nGiảm căng thẳng\nHỗ trợ giảm cân\n---\n*Cách sử dụng\nPha 3g trà với 150ml nước sôi 70-75°C\nỦ trong 1-2 phút\nCó thể pha được 4-5 lần',
        '10',
        '[\"683ad3aea9adc1.63735988_bach-tra.jpg\", \"sp1.webp\", \"sp6.webp\", \"sp7.webp\"]',
        b'1',
        b'1',
        'bạch trà, trà trắng, trà quý hiếm, trà phúc kiến, trà cao cấp',
        'Phúc Kiến, Trung Quốc',
        '500000',
        'Phơi sương tự nhiên',
        'Bạch trà trà quý hiếm với hương thơm tinh tế và vị ngọt thanh khiết',
        'bach-tra',
        '50g'
    );

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;