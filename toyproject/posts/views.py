from django.shortcuts import render, redirect
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods 
import json
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime

# Create your views here.
@require_http_methods(["POST", "GET"])
def post_list(request):
    if request.method == "POST":  # 새 게시글 생성 & 저장장
        body = json.loads(request.body.decode('utf-8'))

	    # 새로운 데이터를 DB에 생성
        new_post = Post.objects.create(
            title = body['title'],
            user = body['user'],
            content = body['content'],
            password = make_password(body['password'])
        )
    
	    # Json 형태 반환 데이터 생성
        new_post_json = {
            "id": new_post.id,
            "title": new_post.title,
            "user": new_post.user, 
            "content": new_post.content,
            "created_at": localtime(new_post.created_at).strftime("%Y-%m-%d %H:%M:%S")
        }

        return JsonResponse({
            'status': 200,
            'message': '게시글 생성 성공',
            'data': new_post_json
        })
    
    if request.method == "GET": # 게시글 목록 조회(최신순 정렬)
        post_list = Post.objects.all().order_by('-created_at')  # 최신순으로 정렬
        post_list_json = []

        # 게시글을 하나씩씩 Json 형태로 변환
        for post in post_list:
            post_json = {
                "id": post.id,
                "title": post.title,
                "user": post.user, 
                "content": post.content,
                "created_at": localtime(post.created_at).strftime("%Y-%m-%d %H:%M:%S")
            }
            post_list_json.append(post_json)

        return JsonResponse({
            'status': 200,
            'message': '게시글 조회 성공',
            'data': post_list_json
        })
    
@require_http_methods(["DELETE"])
def post_details(request, post_id):
    if request.method == "DELETE":
        #게시글 존재하는지 확인(없으면 404 에러), 비밀번호 입력
        post = get_object_or_404(Post, id=post_id)
        body = json.loads(request.body)
        input_password = body.get('password')

        # 입력한 비밀번호가 게시글 비밀번호와 일치하는지 확인
        if check_password(input_password, post.password):
            post.delete()
            return JsonResponse({
                'status': 200,
                'message': '게시글 삭제 성공'
            })
        else:
            return JsonResponse({
                'status': 400,
                'message': '비밀번호가 틀립니다.'
            })