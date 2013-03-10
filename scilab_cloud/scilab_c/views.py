import subprocess
import simplejson as json
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.shortcuts import render_to_response
import re
import os
from reportlab.pdfgen import canvas
import datetime
from reportlab.lib.units import inch
from django.views.decorators.csrf import csrf_exempt
from scilab_cloud.settings import GRAPH_ROOT
def default_view(request):
	try:
		user_id = request.session['user_id']
	except:
		return HttpResponseRedirect("/login")
	return render_to_response('../public/default.html',{'input':'//Type Code Here','uid':user_id,'username':request.session['username']})

@csrf_exempt
def scilab_new_evaluate(request):
    if request.method =="GET":

        return render_to_response('../public/default.html',{'input':'//Type Code Here','uid':request.session['user_id'],'username':request.session['username']})
    all_code = request.POST.get('scilab_code')
    all_code = all_code.replace("clc;","")
    all_code = all_code.replace("clear;","")
    all_code = all_code.replace("clear all;","")
    all_code = "mode(2)\n"+all_code
    try:
        user=request.POST.get('external_user')
        request.session['user_id']='3'
    except:
        print "do nothing"
    filter_for_system = re.compile("unix_g|unix_x|unix_w|unix_s|host|newfun|execstr|ascii|mputl|dir\(\)")
    if  (filter_for_system.findall(all_code)):
        return HttpResponse(json.dumps({'input':'System commnads are not supported','uid':request.session['user_id'],'username':request.session['username'],'output':'System commands are disabled','graph':'','graphs':''  }),'application/json')
    graphics_mode = request.POST.get('graphicsmode')
    if not graphics_mode:
        cwd = GRAPH_ROOT + "/graphs/" + str(request.session['user_id'])
        if not os.path.exists(cwd):
            os.makedirs(cwd)
        filename=datetime.datetime.now().strftime("%Y-%m-%d%H-%M-%S")
        all_code  = all_code +"\n"+"\n quit();"
        filetowrite = open(cwd+"/"+filename+".sce","w")
        filetowrite.write(all_code)
        filetowrite.close()
        filetoread = cwd+"/"+filename+".sce"
        process = subprocess.Popen('scilab-cli -nb -nwni -f '+filetoread ,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE)
	soutput = process.communicate()[0]
        soutput = soutput.strip()
        return HttpResponse(json.dumps({"input":all_code,"output":soutput,"graph":""}),'application/json')

    original_code = all_code
    cwd = GRAPH_ROOT + "/graphs/" + str(request.session['user_id'])
    filename=datetime.datetime.now().strftime("%Y-%m-%d%H-%M-%S")
    cwdsf = cwd +"/"+ filename +"-code.sce"
    if not os.path.exists(cwd):
        os.makedirs(cwd)
    f = open(cwdsf,"w")
    user_id = str(request.session['user_id'])
    graph = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S").replace(" ","")
    all_code = "driver(\"PNG\");\n" + "\n xinit(\""+cwd+"/"+graph+".gif\");\n" + all_code+ "\nxend();\n" + "\nquit();"
    f.write(all_code)
    f.close()
    p=subprocess.Popen("scilab-adv-cli -nb -f "+ cwdsf , shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    out, err = p.communicate()
    return HttpResponse(json.dumps({"input":original_code,"output":out,"graph":graph,"user_id":user_id}),'application/json')

def download(request,graphname):
	response = HttpResponse(mimetype='application/pdf')
	response['Content-Disposition'] = 'attachment; filename='+str(graphname)+'.pdf'
	p = canvas.Canvas(response)
	cwd = "/home/cfduser/SANDBOX/scilab_cloud" + "/graphs/" + str(request.session['user_id'])+"/"
	p.drawImage(cwd+str(graphname)+".png", 1*inch,1*inch, width=5*inch,height=5*inch,mask=None)
        p.showPage()
 	p.save()
        return response
