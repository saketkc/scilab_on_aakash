from django.conf.urls.defaults import *
import os.path
from scilab_cloud import settings
from scilab_cloud.scilab_c.views import *
from scilab_cloud.login_manager.views import *
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    (r'^$',login),
    (r'^cloud/login/$',login),
    (r'^cloud/scilab_view',default_view),
    (r'^logout/$',logout),
    (r'^cloud/scilab_evaluate',scilab_new_evaluate),

    (r'download/(?P<graphname>.*)/',download),
    (r'^cloud/public/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.MEDIA_ROOT}),
    (r'^graphs/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.GRAPH_ROOT}),
)
