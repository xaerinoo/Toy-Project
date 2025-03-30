from django.contrib import admin
from .models import Category
from posts.models import Post

# Register your models here.
# admin.site.register(Category)

# ManyToManyField의 중간 테이블을 Inline으로 사용
class PostInline(admin.TabularInline):
    model = Post.category.through  # Post와 Category를 연결하는 중간 테이블
    extra = 1                        # 기본으로 보여줄 빈 폼 개수

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    # Category 상세 페이지에서 연결된 Post 목록을 Inline으로 보여줌
    inlines = [PostInline]