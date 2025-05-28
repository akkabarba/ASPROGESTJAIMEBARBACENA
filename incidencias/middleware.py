from django.shortcuts import redirect
from django.conf import settings

class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_urls = [
            '/accounts/login/',
            '/bienvenida/',  # página pública
            '/admin/',
        ]

    def __call__(self, request):
        if not request.user.is_authenticated and not any(request.path.startswith(url) for url in self.exempt_urls):
            return redirect('/bienvenida/')
        return self.get_response(request)
