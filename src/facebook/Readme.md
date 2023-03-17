## Sơ đồ hoạt động của facebook
1. Truy cập vào trang chat trên bussiness của facebook (Khi vào trang này FB sẽ tự redirect sang Page đầu tiên).
2. Tiến hành bóc tách HTML. Sử dụng `Stack` và hàm `GetModule` để tìm ra giá trị JSON có trong HTML.

    2.1 Các giá trị cần lấy:
    - dstg : 1 mã token random ngẫu nhiên cần gửi ở mỗi request
    -  