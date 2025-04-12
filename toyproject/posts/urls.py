from django.urls import path
from posts.views import *

urlpatterns = [
    path('', post_list, name="post_list"),  # Post 생성, 전체 조회회
    path('<int:post_id>', post_details, name="post_details"),  # Post 단일 삭제
]