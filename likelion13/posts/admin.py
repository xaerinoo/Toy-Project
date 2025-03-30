from django.contrib import admin
from .models import Post, Comment
from categories.models import Category

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1  # 댓글을 추가로 입력할 수 있는 폼 개수

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created', 'updated', 'status', 'user') # admin 페이지에서 보여줄 필드
    filter_horizontal = ('category',) #하나의 post에 여러 개의 category를 선택
    inlines = [CommentInline] # Post 상세 페이지에서 댓글을 Inline으로 보여줌

admin.site.register(Comment)