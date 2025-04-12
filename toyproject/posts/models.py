from django.db import models

# Create your models here.
class Post(models.Model):
    id = models.AutoField(primary_key=True)  #게시글 id: 자동 증가하는 기본키
    title = models.CharField(max_length=30)  #제목: 최대 길이 30
    user = models.CharField(max_length=10)  #작성자: 최대 길이 10
    content = models.TextField()  #내용
    password = models.CharField(max_length=128)  #해시된 비밀번호: 최대 길이 128
    created_at = models.DateTimeField(auto_now_add=True)  #작성일시

    def __str__(self): # 표준 파이썬 클래스 메서드, 사람이 읽을 수 있는 문자열을 반환하도록 함
        return self.title