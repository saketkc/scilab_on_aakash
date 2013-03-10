import os
import sys
sys.path.append("/home/saket/SANDBOX")
sys.path.append("/home/saket/SANDBOX/scilab_cloud")

os.environ['DJANGO_SETTINGS_MODULE'] = 'scilab_cloud.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

