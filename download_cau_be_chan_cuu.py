import requests
import os
import sys

urls = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhqmlgjVMTbvMyIl4zXsUWbGxqOb68vmUqszc4CLgD07Os7p3L5A4rADRKxQpknU55nZFHFSj6KI4ot0d6HWKs-FikXlNh0LPv14T5H2-TChdj1fdw4uM9KVvhL6jFcKFFoFaqxSxyzxQY/s1600/truyen-tranh-cau-be-chan-cuu-2.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjn0RvhK1D-2SBcuyTA9CU0aSpTcUQ7SnGCygZDOK-tMyGpuIsqJgCW2xaNnbluv7ufC90QQWBHMMVpm0QYZ6EmpnAYT4uO26S0i2ocrZ-3qK3Nlfs_ewdfz7cvcSyQ4z3W0FQhCIBT7yOE/s1600/truyen-tranh-cau-be-chan-cuu-3.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjaDGsv6fdvzAYRHs797IupZ84zVh5XgEjqKSxus_O5_zeR6NJB2TKxexiZTEItbJI8d_nRuCPj73Xy8nqTy55IpDievej-6sgV-vkymj_foEqm8HgdrgGqO4KKPMcamHV33Yc-XW3YvYDl/s1600/truyen-tranh-cau-be-chan-cuu-4.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkHXIy0ObeEwKf90eCfQICYh6SVinGXfNXAQNylNUNZ0aduzp4FVgLwyhvUXdzZoOfuOTMyej-Wo1KdOmoLK2x-MoHxdO9CyciPw8NkEZ33qB0wfqVGQbFqGZkaCxsXu-Amhcu6ss8tMl7/s1600/truyen-tranh-cau-be-chan-cuu-5.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVSmvpQv3sNP-TdES8aJZNW_wmok_zvVvARmExA_gehq9zGYSUm51u2qqe1E4Z4LyqwRlsMSWU6cz3C6ont4LdurwzlD1Nbpu6AbhdgH3mjCPNDOOI13e_CCR1tYpDXiBlw-a_JI1fQYVo/s1600/truyen-tranh-cau-be-chan-cuu-6.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtqKHLZbwQ2nBqeBMXuQaKXJgxmKnyYbVbddUq1Czh4Hj1sDBuWFnPBJ6vn1BVx26Jy-fEqjU0B4MCritnczdCF_XCZjgKL1qWJT1zozdwStLGSyPPHnEttbkABnF4WcT6SIdBpy1DeFqG/s1600/truyen-tranh-cau-be-chan-cuu-7.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimj2VLZ-h83PYS_KLeo3K3y5DFQslsTufEUIsDRxfj07I1PtUkO4Axan9xr0Ev09KAac24AED0Ru9kDbL4TpMSPfA-q9GSDusA4db7KAW2bh0g-yC3ioXo8e5Lu2AbBCanpZy7ZmNbgRJ4/s1600/truyen-tranh-cau-be-chan-cuu-8.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwtvc_e0OVTNfYIc2M3-3WpHPO_tg4s6NG7VGtz5A0s4oLsxI7iA1yNV30UPDHag9ogi8gt233-65QNm0gJmm1UYH95vxJWPbNCCGCco7kq8Ho92Dkni4HopmjoTFAMlxL_pTaeO89enAj/s1600/truyen-tranh-cau-be-chan-cuu-9.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8nBVWcKyjr2NcJszYqa0oXj71DfLzSuV24xKdlXdvEJcYwPWFIvrOGMhErWk0OljrM2QjMV_mcRTziwCokdelNoss7o6-tJ9TOxBVEvH5p-N5-1oU2tqbypYigs88erMBlSEdjhGD9QK6/s1600/truyen-tranh-cau-be-chan-cuu-10.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR4U-PLGh83YKQSIEOGCzYd04zkrOCFXQ_zZOxOZpdzWRVE7D8212TAoJjIr_GvGVkHrp8ryeB1smkS85Zb1_mea4NRS1JB-eaMrowgpqNgCdkuSu2TPtgJiQLTqqEEzVJfKnibqDXjzpL/s1600/truyen-tranh-cau-be-chan-cuu-11.png"
]

output_dir = "temp_manga_images/cau-be-chan-cuu"
os.makedirs(output_dir, exist_ok=True)

for i, url in enumerate(urls):
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            filename = f"page-{str(i+1).zfill(3)}.png"
            with open(os.path.join(output_dir, filename), 'wb') as f:
                f.write(response.content)
            print(f"Downloaded {filename}")
        else:
            print(f"Failed to download {url}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
