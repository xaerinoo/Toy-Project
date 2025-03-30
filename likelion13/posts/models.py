from django.db import models
from accounts.models import User
from categories.models import Category

# Create your models here.
# 추상 클래스 정의
class BaseModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Post(BaseModel):

    CHOICES = (
        ('STORED', '보관'),
        ('PUBLISHED', '발행')
    )

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=30)  #이 문자열을 반환환
    content = models.TextField()
    status = models.CharField(max_length=15, choices=CHOICES, default='STORED')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post')
    category = models.ManyToManyField(Category, blank=True, related_name='post') # 다대다 관계이므로 post가 삭제되어도 category는 유지

    def __str__(self): # 표준 파이썬 클래스 메서드, 사람이 읽을 수 있는 문자열을 반환하도록 함
        return self.title
    
class Comment(BaseModel):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comment')
    user = models.CharField(max_length=30, default='anonymous')

    def __str__(self):
        return self.content