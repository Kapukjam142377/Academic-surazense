from pathlib import Path
from tkinter import Tk, Canvas, Entry, Text, Button, PhotoImage
import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import tkinter.filedialog as filedialog
from tkinter.filedialog import asksaveasfile, askopenfilename
from PIL import Image
from PIL import ImageTk
import threading
import numpy as np
import scipy.signal
from scipy.interpolate import UnivariateSpline
from time import strftime
import csv 
import serial
import sys
import time
import os

OUTPUT_PATH = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
ASSETS_PATH = OUTPUT_PATH / Path("./icon")

def relative_to_assets(relative_path):
    return os.path.join(ASSETS_PATH, relative_path)

def on_closing():
    if messagebox.askokcancel("Quit", "Do you want to quit"):
        app.destroy()

class Main_Home(Tk):
    def __init__(self, *args, **kwargs):
        Tk.__init__(self, *args, **kwargs)

        self.h = self.winfo_screenheight()
        self.w = self.winfo_screenwidth()
        self.geometry("%sx%s+0+0"%(self.w, self.h-80))
        self.canvas = Canvas(self, bg = "#EBF4FF", height = self.h, 
                        width = self.w, bd = 0, highlightthickness = 0, relief = "ridge")
        self.canvas.place(x = 0, y = 0)

        self.avg_data1 = 0
        self.avg_data2 = 0
        self.raw_data = 0
        self.result = 0
        self.variable_status_calibration = False
        self.variable_status_measurement = False
        self.prepare_measure = False
        self.vari_change_page = 'A'
        self.freq_range_mean = []
        self.check_connect = False
        self.status_collect_data_before = False
        self.status_collect_data_after = False
        self.check_page = 'blank'
        self.img()
        self.button()
        self.txt()
        self.selecting_com_port()
        self.graph()
        self.find_device()
    
    def img(self):
        img = Image.open(relative_to_assets("image_1.png"))
        width = int((1536/1536*self.w))
        height = int((784/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.image_image_1 =  ImageTk.PhotoImage(img)
        x = int((768/1536*self.w))
        y = int((392/864*self.h))
        self.image_1 = self.canvas.create_image(x, y, image = self.image_image_1)

        img = Image.open(relative_to_assets("calibration_white.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.c_white =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("calibration_green.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.c_green =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("calibration_yellow.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.c_yellow =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("calibration_red.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.c_red =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("measure_white.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.m_white =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("measure_green.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.m_green =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("measure_yellow.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.m_yellow =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("measure_red.png"))
        width = int((994/1536*self.w))
        height = int((40/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.m_red =  ImageTk.PhotoImage(img)

        x = int((511/1536*self.w))
        y = int((454/864*self.h))
        self.image_2 = self.canvas.create_image(x, y, image = self.c_white)

    def button(self):
        img = Image.open(relative_to_assets("button_3_1.png"))
        width = int((61/1536*self.w))
        height = int((62/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.img_m_stop =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_3_2.png"))
        width = int((61/1536*self.w))
        height = int((62/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.img_m_pause =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_3_3.png"))
        width = int((61/1536*self.w))
        height = int((62/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.img_m_start =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_3_4.png"))
        width = int((61/1536*self.w))
        height = int((62/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.img_m_pause_stop =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_1.png"))
        width = int((39/1536*self.w))
        height = int((38/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.open_file =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_2.png"))
        width = int((39/1536*self.w))
        height = int((38/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.folder_collect =  ImageTk.PhotoImage(img)

        x = int((1370/1536*self.w))
        y = int((89/864*self.h))
        w = int((39/1536*self.w))
        h = int((38/864*self.h))
        self.c_folder1 = Button(self, image = self.open_file, borderwidth=0,
                               highlightthickness=0, command=lambda: self.call_csv_file1('before'),
                               relief="flat", activebackground='#D8ECFF', background='#D8ECFF')
        self.c_folder1.place(x=x, y=y, width=w, height=h)

        x = int((1370/1536*self.w))
        y = int((143/864*self.h))
        w = int((39/1536*self.w))
        h = int((38/864*self.h))
        self.c_folder2 = Button(self, image = self.open_file, borderwidth=0,
                               highlightthickness=0, command=lambda: self.call_csv_file1('after'),
                               relief="flat", activebackground='#D8ECFF', background='#D8ECFF')
        self.c_folder2.place(x=x, y=y, width=w, height=h)

        img = Image.open(relative_to_assets("collect_start.png"))
        width = int((37/1536*self.w))
        height = int((38/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.collect_start =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("collect_stop.png"))
        width = int((37/1536*self.w))
        height = int((38/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.collect_stop =  ImageTk.PhotoImage(img)

        x = int((1411/1536*self.w))
        y = int((89/864*self.h))
        w = int((37/1536*self.w))
        h = int((38/864*self.h))
        self.collect_data1 = Button(self, image = self.collect_start, borderwidth=0,
                               highlightthickness=0, command = lambda: self.collect_data_before(),
                               relief="flat", activebackground='#D8ECFF', background='#D8ECFF')
        self.collect_data1.place(x=x, y=y, width=w, height=h)

        x = int((1411/1536*self.w))
        y = int((143/864*self.h))
        w = int((37/1536*self.w))
        h = int((38/864*self.h))
        self.collect_data2 = Button(self, image = self.collect_start, borderwidth=0,
                               highlightthickness=0, command = lambda: self.collect_data_after(),
                               relief="flat", activebackground='#D8ECFF', background='#D8ECFF')
        self.collect_data2.place(x=x, y=y, width=w, height=h)

        x = int((1480/1536*self.w))
        y = int((208/864*self.h))
        w = int((37/1536*self.w))
        h = int((38/864*self.h))
        self.calcurate = Button(self, image = self.collect_start, borderwidth=0,
                               highlightthickness=0, command=lambda:self.call_result(),
                               relief="flat", activebackground='#D8ECFF', background='#D8ECFF')
        self.calcurate.place(x=x, y=y, width=w, height=h)

        img = Image.open(relative_to_assets("collect_refresh.png"))
        width = int((38/1536*self.w))
        height = int((38/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.collect_refresh =  ImageTk.PhotoImage(img)

        x = int((1450/1536*self.w))
        y = int((89/864*self.h))
        w = int((38/1536*self.w))
        h = int((38/864*self.h))
        self.collect_refresh1 = Button(self, image = self.collect_refresh, borderwidth=0,
                               highlightthickness=0, command=lambda:self.collect_data_refresh('before'),
                               relief="flat", activebackground='#D8ECFF', background='#D8ECFF')
        self.collect_refresh1.place(x=x, y=y, width=w, height=h)

        x = int((1450/1536*self.w))
        y = int((143/864*self.h))
        w = int((38/1536*self.w))
        h = int((38/864*self.h))
        self.collect_refresh2 = Button(self, image = self.collect_refresh, borderwidth=0,
                               highlightthickness=0, command=lambda:self.collect_data_refresh('after'),
                               relief="flat", activebackground='#D8ECFF', background='#D8ECFF')
        self.collect_refresh2.place(x=x, y=y, width=w, height=h)

        img = Image.open(relative_to_assets("button_3.png"))
        width = int((137/1536*self.w))
        height = int((66/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.QCM_green =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_8.png"))
        width = int((137/1536*self.w))
        height = int((66/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.QCM_red =  ImageTk.PhotoImage(img)
        x = int((871/1536*self.w))
        y = int((494/864*self.h))
        w = int((137.0/1536*self.w))
        h = int((64.0/864*self.h))
        self.b_QCM = Button(self, image = self.QCM_green, borderwidth=0,
                               highlightthickness=0, command=lambda: self.change_status_calibration(),
                               relief="flat", activebackground='#EBF4FF', background='#EBF4FF')
        self.b_QCM.place(x=x, y=y, width=w, height=h)

        img = Image.open(relative_to_assets("button_6.png"))
        width = int((198/1536*self.w))
        height = int((66/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.calibration_green =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_7.png"))
        width = int((198/1536*self.w))
        height = int((66/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.calibration_red  =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_5.png"))
        width = int((198/1536*self.w))
        height = int((66/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.measurement_red  =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_4.png"))
        width = int((198/1536*self.w))
        height = int((66/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.measurement_green  =  ImageTk.PhotoImage(img)

        x = int((667/1536*self.w))
        y = int((493/864*self.h))
        w = int((198.0/1536*self.w))
        h = int((64.0/864*self.h))
        self.b_measurement = Button(self, image = self.measurement_red, borderwidth=0, 
                               highlightthickness=0, command=lambda: self.cal_measure(),
                               relief="flat", activebackground='#EBF4FF', background='#EBF4FF')
        self.b_measurement.place(x=x, y=y, width=w, height=h)

        x = int((830/1536*self.w))
        y = int((711/864*self.h))
        w = int((39/1536*self.w))
        h = int((38/864*self.h))
        self.b_direct_save = Button(self, image = self.folder_collect, borderwidth=0,
                               highlightthickness=0, command=lambda: self.call_directory('measuring'), relief="flat",
                               activebackground='#D8ECFF', background='#D8ECFF')
        self.b_direct_save.place(x=x, y=y, width=w, height=h)

        x = int((300/1536*self.w))
        y = int((610/864*self.h))
        w = int((39/1536*self.w))
        h = int((38/864*self.h))
        self.open_bc = Button(self, image = self.open_file, borderwidth=0,
                               highlightthickness=0, command=lambda: self.call_csv_file1('baseline_correction'), relief="flat",
                               activebackground='#D8ECFF', background='#D8ECFF')
        self.open_bc.place(x=x, y=y, width=w, height=h)

        x = int((887/1536*self.w))
        y = int((610/864*self.h))
        w = int((39/1536*self.w))
        h = int((38/864*self.h))
        self.directory_bc = Button(self, image = self.folder_collect, borderwidth=0,
                               highlightthickness=0, command=lambda: self.call_directory('baseline'), relief="flat",
                               activebackground='#D8ECFF', background='#D8ECFF')
        self.directory_bc.place(x=x, y=y, width=w, height=h)

        img = Image.open(relative_to_assets("button_13.png"))
        width = int((39/1536*self.w))
        height = int((38/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.csv_save  =  ImageTk.PhotoImage(img)
        x = int((876/1536*self.w))
        y = int((711/864*self.h))
        w = int((39/1536*self.w))
        h = int((38/864*self.h))
        self.b_csv = Button(self, image = self.csv_save, borderwidth=0,
                                highlightthickness=0, command=lambda: self.call_save_csv_file('measuring'), relief="flat",
                                activebackground='#D8ECFF', background='#D8ECFF')
        self.b_csv.place(x=x, y=y, width=w, height=h)

        x = int((933/1536*self.w))
        y = int((610/864*self.h))
        w = int((39/1536*self.w))
        h = int((38/864*self.h))
        self.bc_csv = Button(self, image = self.csv_save, borderwidth=0,
                                highlightthickness=0, command=lambda: self.call_save_csv_file('baseline'), relief="flat",
                                activebackground='#D8ECFF', background='#D8ECFF')
        self.bc_csv.place(x=x, y=y, width=w, height=h)

        img = Image.open(relative_to_assets("button_14.png"))
        width = int((38/1536*self.w))
        height = int((39/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.img_refresh  =  ImageTk.PhotoImage(img)
        x = int((170/1536*self.w))
        y = int((515/864*self.h))
        w = int((32.0/1536*self.w))
        h = int((37.0/864*self.h))
        self.b_refresh = Button(self, image = self.img_refresh, borderwidth=0,
                                highlightthickness=0, command=lambda: self.find_device(), relief="flat",
                                activebackground='#EBF4FF', background='#EBF4FF')
        self.b_refresh.place(x=x, y=y, width=w, height=h)

        img = Image.open(relative_to_assets("button_15.png"))
        width = int((38/1536*self.w))
        height = int((39/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.view1_clicked  =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_16.png"))
        width = int((38/1536*self.w))
        height = int((39/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.view1_hold  =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_17.png"))
        width = int((38/1536*self.w))
        height = int((39/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.view2_clicked  =  ImageTk.PhotoImage(img)

        img = Image.open(relative_to_assets("button_18.png"))
        width = int((38/1536*self.w))
        height = int((39/864*self.h))
        img = img.resize((width,height), Image.Resampling.LANCZOS)
        self.view2_hold  =  ImageTk.PhotoImage(img)

    def txt(self):
        x = int((1165/1536*self.w))
        y = int((377/864*self.h))
        w = int((210/1536*self.w))
        h = int((45/864*self.h))
        self.select_tumor = ttk.Combobox(self, values=['EGFR'], justify = 'center', font=("Times New Roman", 22), foreground='blue')
        self.select_tumor.place(x=x, y=y, width=w, height=h)
        self.select_tumor.current(0)
        
        x = int((106.5/1536*self.w))
        y = int((500/864*self.h))
        self.con = self.canvas.create_text((x, y), justify = 'center', text = 'No device connected.', \
                                                font=("Times New Roman", 12), fill = 'red')
        
        x = int((955/1536*self.w))
        y = int((620/864*self.h))
        self.detail = self.canvas.create_text((x, y), text = "", font=("Times New Roman", 16))
        
        self.name_var = tk.StringVar()
        self.directory_var = tk.StringVar()
        self.name_var.set("")
        self.directory_var.set("")
        
        x = int((170/1536*self.w))
        y = int((717/864*self.h))
        w = int((27/1536*self.w))
        self.name_entry = tk.Entry(self, textvariable = self.name_var, width = w, font=("Times New Roman", 14,'normal'))
        self.name_entry.place(x = x, y = y)

        x = int((565/1536*self.w))
        y = int((717/864*self.h))
        w = int((27/1536*self.w))
        self.directory_entry = tk.Entry(self, textvariable = self.directory_var, width = w, font=("Times New Roman", 14,'normal'), state='readonly')
        self.directory_entry.place(x = x, y = y)

        self.open_bc_var = tk.StringVar()
        self.save_bc_var = tk.StringVar()
        self.directory_bc_var = tk.StringVar()
        self.open_bc_var.set("")
        self.save_bc_var.set("")
        self.directory_bc_var.set("")

        x = int((169/1536*self.w))
        y = int((616/864*self.h))
        w = int((13/1536*self.w))
        self.open_bc_entry = tk.Entry(self, textvariable = self.open_bc_var, width = w, font=("Times New Roman", 14,'normal'), state='readonly')
        self.open_bc_entry.place(x = x, y = y)

        x = int((457/1536*self.w))
        y = int((616/864*self.h))
        w = int((13/1536*self.w))
        self.save_bc_entry = tk.Entry(self, textvariable = self.save_bc_var, width = w, font=("Times New Roman", 14,'normal'))
        self.save_bc_entry.place(x = x, y = y)

        x = int((732/1536*self.w))
        y = int((616/864*self.h))
        w = int((15/1536*self.w))
        self.directory_bc_entry = tk.Entry(self, textvariable = self.directory_bc_var, width = w, font=("Times New Roman", 14,'normal'), state='readonly')
        self.directory_bc_entry.place(x = x, y = y)

        x = int((1261/1536*self.w))
        y = int((108.5/864*self.h))
        self.frequency_before = self.canvas.create_text((x, y), justify = 'center', text = ' --,---,--- Hz', \
                                                font=("Times New Roman", 14))
        
        x = int((1261/1536*self.w))
        y = int((160.5/864*self.h))
        self.frequency_after = self.canvas.create_text((x, y), justify = 'center', text = ' --,---,--- Hz', \
                                                font=("Times New Roman", 14))
        
        x = int((1178/1536*self.w))
        y = int((227.5/864*self.h))
        self.frequency_delta = self.canvas.create_text((x, y), justify = 'center', text = ' --,---,--- ', \
                                                font=("Times New Roman", 14))
        
        x = int((1275/1536*self.w))
        y = int((594/864*self.h))
        self.show_result = self.canvas.create_text((x, y), justify = 'center', text = '', \
                                                font=("Times New Roman", 45))
        
        self.threshold_var = tk.IntVar()
        self.threshold_var.set(10)
        x = int((1375/1536*self.w))
        y = int((215/864*self.h))
        w = int((10/1536*self.w))
        self.threshold_entry = tk.Entry(self, textvariable = self.threshold_var,
                                         width = w, 
                                         font=("Times New Roman", 14,'normal'),
                                         justify='center')
        self.threshold_entry.place(x = x, y = y)

    def selecting_com_port(self):
        self.vari_comport = tk.StringVar() 
        self.comport = ttk.Combobox(self, textvariable = self.vari_comport, state='readonly')
        x = int((55/1536*self.w))
        y = int((520/865*self.h))
        w = int((100/1536*self.w))
        h = int((23/865*self.h))
        #self.comport.current(0)
        self.comport.place(x = x, y = y, width = w, height = h)
        self.comport.bind("<<ComboboxSelected>>", self.select_port)

    def graph(self):
        self.fig_time = plt.Figure(figsize=(1,2), dpi=80, facecolor='#D8ECFF')
        self.fig_time.subplots_adjust(bottom = 0.20)
        self.gt = self.fig_time.add_axes([0.10, 0.20, 0.87, 0.65]) #(Left, bottom, right, top)
        self.line1 = FigureCanvasTkAgg(self.fig_time, self)
        x = int((24/1536*self.w))
        y = int((24/864*self.h))
        w = int((974/1536*self.w))
        h = int((391/864*self.h))
        self.line1.get_tk_widget().place(x = x, y = y, width = w, height = h)#899
        self.font1 = {'family':'serif','color':'black','size':20}
        self.font2 = {'family':'serif','color':'black','size':15}
        self.gt.grid(True)
        self.gt.set_title('Calibration\n', fontdict = self.font1) 
        self.gt.set_xlabel('\nFrequency (MHz)', fontdict = self.font2)
        self.gt.set_ylabel('Amplitude (dB)\n', fontdict = self.font2)
        self.gt.tick_params(axis='x', colors='black')
        self.gt.tick_params(axis='y', colors='black')
        self.gt.spines['left'].set_color('black')
        self.gt.spines['bottom'].set_color('black')
        self.gt.set_facecolor('#D8ECFF')

    def find_device(self):
        if sys.platform.startswith('win'):
            ports = ['COM%s' % (i + 1) for i in range(256)]
        else:
            raise EnvironmentError('Unsupported platform')
        
        self.result = []

        for port in ports:
            try:
                s = serial.Serial(port)
                s.close()
                self.result.append(port)
            except (OSError, serial.SerialException):
                pass
        
        if len(self.result) > 0:
            try:
                self.comport.set('')
                self.comport['values'] = self.result
                self.comport.current(0)
                self.serial = serial.Serial()
                self.serial.port = self.vari_comport.get()
                self.serial.baudrate = 115200
                self.serial.parity = serial.PARITY_NONE
                self.serial.stopbits = serial.STOPBITS_ONE
                self.serial.bytesize = serial.EIGHTBITS
                self.serial.timeout = 1
                self.canvas.itemconfig(self.con, text = self.result[0] + ' is connected.', fill = 'green')
                self.check_connect = True

            except Exception as e:
                self.check_connect = False
                self.canvas.itemconfig(self.con, text = 'No device connected.', fill = 'red')
        else:
            self.check_connect = False
            self.canvas.itemconfig(self.con, text = 'No device connected.', fill = 'red')

    def select_port(self):
        if self.vari_comport.get() != '':
            try:
                self.serial = serial.Serial()
                self.serial.port = self.vari_comport.get()
                self.serial.baudrate = 115200
                self.serial.parity = serial.PARITY_NONE
                self.serial.stopbits = serial.STOPBITS_ONE
                self.serial.bytesize = serial.EIGHTBITS
                self.serial.timeout = 1
                self.canvas.itemconfig(self.con, text = self.result[0] + ' is connected.', fill = 'green')
                self.check_connect = True
            
            except Exception as e:
                self.check_connect = False
                self.canvas.itemconfig(self.con, text = 'No device connected.', fill = 'red')
        
        else:
            self.check_connect = False
            self.canvas.itemconfig(self.con, text = 'No device connected.', fill = 'red')

    def change_status_calibration(self):
        if self.variable_status_calibration == False:
            self.variable_status_calibration = True
            self.check_start = True
        else:
            self.variable_status_calibration = False
            self.check_start = False
        self.thr1 = threading.Thread(target = self.run)
        self.thr1.start()

    def change_status_measurement(self, vari):
        if vari == 'Start' and self.variable_status_measurement == False:
            self.m_start.config(image = self.img_m_stop)
            self.variable_status_measurement = True
            self.samples = 1001
            self.exten = 7500    
            self.canvas.itemconfig(self.image_2, image = self.m_yellow)
            self.start = int(self.max_freq_mag[0]) - self.exten
            self.stop = int(self.max_freq_mag[0]) + 2500  #2598[1123],2499[1112],7503[15004],4002[1279]
            self.points = int(self.stop - self.start) + 1
            self.step = (self.stop - self.start)/(self.samples - 1)
            self.readFREQ = np.arange(self.samples) * (self.step) + self.start
            self._data = np.empty(50, dtype = float)
            self._data.fill(np.nan)

            self.freq_range_mean = []
            self.time_plot = []
            self.relative_time = []

            if not self.serial.isOpen():
                self.serial.open() 
                self.serial.flushInput()
                self.serial.flushOutput()
                self.k = 0
                
                self.thr2 = threading.Thread(target = self.run1)
                self.thr2.start()

        elif vari == 'Pause':
            self.m_pause.config(image = self.img_m_pause_stop)
            self.canvas.itemconfig(self.image_2, image = self.m_yellow)
            if self.variable_status_measurement and len(self.freq_range_mean) > 0:
                self.variable_status_measurement = False
            elif self.variable_status_measurement == False and len(self.freq_range_mean) > 0:
                self.m_pause.config(image = self.img_m_pause)
                self.variable_status_measurement = True
                
                if not self.serial.isOpen():
                    self.serial.open() 
                    self.serial.flushInput()
                    self.serial.flushOutput()
                    self.thr2 = threading.Thread(target = self.run1)
                    self.thr2.start()
        
        else:
            self.canvas.itemconfig(self.image_2, image = self.m_white)
            self.variable_status_measurement = False
            self.m_start.config(image = self.img_m_start)
    
    def change_page(self, vari):
        self.vari_change_page = vari
        if vari == 'A':
            self.b_view1.config(image = self.view1_clicked)
            self.b_view2.config(image = self.view2_hold)

            self.gt.clear()
            self.gt.grid(True)
            self.gt.set_title('Measurement\n', fontdict = self.font1) 
            self.gt.set_xlabel('\nNumber', fontdict = self.font2)
            self.gt.set_ylabel('Resonance Frequency (Hz)', fontdict = self.font2)

            if len(self.freq_range_mean) > 0:
                self.gt.plot(self.freq_range_mean[1:], color = 'blue')
                self.gt.ticklabel_format(style='plain', axis='y', useOffset=False)
                self.gt.yaxis.set_major_formatter(FuncFormatter(self.comma_format))

            self.line1.draw()

        elif vari == 'B':
            self.b_view1.config(image = self.view1_hold)
            self.b_view2.config(image = self.view2_clicked)            
            self.gt.clear()
            self.gt.grid(True)
            self.gt.set_title('Measurement\n', fontdict = self.font1) 
            self.gt.set_xlabel('\nFrequency (MHz)', fontdict = self.font2)
            self.gt.set_ylabel('Amplitude (dB)', fontdict = self.font2)
            self.gt.set_xlim([self.start/1000000, self.stop/1000000])
            if self.prepare_measure:
                self.gt.plot(self.xf_1, self.filtered_mag, color = 'blue')
                self.gt.set_xlim([self.start/1000000, self.stop/1000000])
            self.line1.draw()

    def run(self):
        if self.check_connect and self.variable_status_calibration:
            self.canvas.itemconfig(self.image_2, image = self.c_yellow)
            self.b_QCM.config(image = self.QCM_red)
            if not self.serial.isOpen():
                self.serial.open() 
                self.serial.flushInput()
                self.serial.flushOutput()
                k=0
                data=[]
                #----------------------------------------------------------
                
                while self.variable_status_calibration:
                    fStep = 1000
                    #3999999
                    startFreq = 8_000_000
                    self.stopFreq  = 12_000_000 #12_000_000
                    samples   = 4001 #4001
                    data_mag = np.linspace(0,0,samples)

                    try:
                        vmax = 4.096
                        bitmax = 65536
                        #bitmax = 65536, 8192
                        ADCtoVolt = vmax / bitmax
                        VCP = 0.9
                        cmd = str(startFreq) + ';' + str(self.stopFreq) + ';' + str(int(fStep)) + '\n'
                        self.serial.write(cmd.encode())
                        buffer = ''

                        while True:
                            buffer += self.serial.read(self.serial.inWaiting()).decode()
                            if 's' in buffer:
                                break
                        data_raw = buffer.split('\r\n')
                        
                        length = len(data_raw)
                        self.variable_status_calibration = False
                        
                        for i in range (length - 2):
                            mag = float(data_raw[i]) * ADCtoVolt
                            data_mag[i] = (mag-VCP) / 0.03
                        data_mag = data_mag[1:]
                        
                        data = np.append(data, data_mag)
                        self.raw_data = data
                        self.xf = np.linspace(8, self.stopFreq/1000000, len(data))
                        self.xf_ = np.linspace(8000000, self.stopFreq, len(data))
                        self.gt.clear()
                        self.gt.grid(True)
                        self.gt.set_title('Calibration\n', fontdict = self.font1)
                        self.gt.set_xlabel('\nFrequency (MHz)', fontdict = self.font2)
                        self.gt.set_ylabel('Amplitude (dB)', fontdict = self.font2)
                        self.gt.plot(self.xf, data, color = 'blue')
                        self.gt.set_xlim([8, self.stopFreq/1000000])
                        self.line1.draw_idle()
                        
                    #ValueError           
                    except Exception as e:
                        self.serial.flushInput()
                        self.serial.flushOutput()
                        self.serial.close()

                    self.base_line = self.baseline_correction(self.xf_, data)
                    self.FindPeak(self.xf_, self.base_line, 4000)
                    
                    if self.max_value_mag[0] > 2.5 and (self.max_freq_mag[0] > 9.5e+06 and self.max_freq_mag[0] < 10.5e+06):
                        self.canvas.itemconfig(self.image_2, image = self.c_green)
                        self.b_measurement.config(image = self.measurement_green)
                        self.check_page = 'measure'
                    else:
                        self.canvas.itemconfig(self.image_2, image = self.c_red)
                        self.b_measurement.config(image = self.measurement_red)
                        self.check_page = 'blank'
                        self.raw_data = 0
                    self.b_QCM.config(image = self.QCM_green)
                    self.variable_status_calibration = False
                    break
                
                if self.check_start:
                    self.gt.clear()
                    self.gt.grid(True)
                    self.gt.set_title('Calibration\n', fontdict = self.font1) 
                    self.gt.set_xlabel('\nFrequency (MHz)', fontdict = self.font2)
                    self.gt.set_ylabel('Amplitude (dB)\n', fontdict = self.font2)
                    self.gt.plot(self.xf, self.base_line, color = 'blue')
                    self.gt.set_xlim([8, self.stopFreq/1000000])
                    self.line1.draw_idle()
                else:
                    self.canvas.itemconfig(self.image_2, image = self.c_white)
                    self.b_QCM.config(image = self.QCM_green)
                    self.variable_status_calibration = False
                    self.b_measurement.config(image = self.measurement_red)
                    self.check_page = 'blank'
                
                self.serial.close()

    def comma_format(self, x, pos):
        return f"{int(x):,}"

    def run1(self):
        while self.check_connect and self.variable_status_measurement:
            data_mag = np.linspace(0, 0, self.samples)
            try:
                vmax = 4.096
                bitmax = 65536 
                #bitmax = 1024
                ADCtoVolt = vmax / bitmax
                VCP = 0.9
                self.start = int(self.max_freq_mag[0]) - self.exten
                self.stop = int(self.max_freq_mag[0]) + 2500  #2598[1123],2499[1112],7503[15004],4002[1279]
                self.step = (self.stop - self.start)/(self.samples - 1)

                cmd = str(self.start) + ';' + str(self.stop) + ';' + str(int(self.step)) + '\n'
                if not self.serial.isOpen():
                    self.serial.open() 
                    self.serial.flushInput()
                    self.serial.flushOutput()

                self.serial.write(cmd.encode())
                buffer = ''        

                while True:
                    buffer += self.serial.read(self.serial.inWaiting()).decode()
                    if 's' in buffer:
                        break
                
                data_raw = buffer.split('\r\n')
                length = len(data_raw)

                for i in range (length - 2):
                    mag = int(data_raw[i]) * ADCtoVolt
                    data_mag[i] = (mag-VCP) / 0.03
                
                #self.xf_1 = np.linspace(self.start/1000000, self.stop/1000000, self.samples)
                #print(self.xf_1)
                #self.data_mag_poly = self.baseline_correction(self.xf_1, data_mag)
                poly = np.polyval(self._coeffs_all, self.readFREQ)
                mag_beseline_corrected = data_mag - poly
                #mag_beseline_corrected = self.data_mag_poly - poly
                self.filtered_mag = self.savitzky_golay(mag_beseline_corrected, window_size = 11, order = 3)

                xrange = range(len(self.filtered_mag))
                freq_range = np.linspace(self.readFREQ[0], self.readFREQ[-1], self.points)
                s = UnivariateSpline(xrange, self.filtered_mag, s = 0.03)
                xs = np.linspace(0, len(self.filtered_mag)-1, self.points)
                mag_result_fit = s(xs)

                index_peak_fit = np.argmax(mag_result_fit, axis = 0)
                self._data = np.roll(self._data, 1)
                self._data[0] = freq_range[int(index_peak_fit)]
                #self.xf_1 = np.arange(len(self.filtered_mag))
                self.xf_1 = np.linspace(self.start/1000000, self.stop/1000000, len(self.filtered_mag))
                self.xf_2 = np.linspace(self.start, self.stop, len(self.filtered_mag))

                #self.FindPeak(self.xf_2, self.filtered_mag, len(self.filtered_mag)-1)
                
            except Exception as e:
                print('Error measurement : ', e)
                self._flag = 1  
                self.serial.flushInput()
                self.serial.flushOutput()
                self.serial.close()
            if self.vari_change_page == 'B':
                self.prepare_measure = True
                self.gt.clear()
                self.gt.grid(True)
                self.gt.set_title('Measurement\n', fontdict = self.font1) 
                self.gt.set_xlabel('\nFrequency (MHz)', fontdict = self.font2)
                self.gt.set_ylabel('Amplitude (dB)', fontdict = self.font2)
                self.gt.plot(self.xf_1, self.filtered_mag, color = 'blue')
                #self.gt.plot(self.xf_1, mag_beseline_corrected, color = 'blue')
                self.gt.set_xlim([self.start/1000000, self.stop/1000000])
                self.line1.draw_idle()

            self.k += 1
            
            if self.k >= 50:
                if self.k == 100:
                    self.k = 50
                if self.variable_status_measurement:
                    self.canvas.itemconfig(self.image_2, image = self.m_green)
  
                vec_app1 = self.savitzky_golay(self._data, window_size = 3, order = 1)
                self.freq_range_mean.append(np.average(vec_app1))

                t = "{}:{}:{}".format(strftime('%H'),strftime('%M'),strftime('%S'))
                #t2 = time.time_ns()
                self.time_plot.append(t)
                self.relative_time.append(time.time_ns()*(10**9))
                
                if self.vari_change_page == 'A' and len(self.freq_range_mean) > 1:
                    self.gt.clear()
                    self.gt.grid(True)
                    self.gt.set_title('Measurement\n', fontdict = self.font1) 
                    self.gt.set_xlabel('\nNumber', fontdict = self.font2)
                    self.gt.set_ylabel('Resonance Frequency (Hz)', fontdict = self.font2)
                    self.gt.plot(self.freq_range_mean[1:], color = 'blue')
                    self.gt.ticklabel_format(style='plain', axis='y', useOffset=False)
                    self.gt.yaxis.set_major_formatter(FuncFormatter(self.comma_format))
                    self.line1.draw_idle()
                if self.status_collect_data_before:
                    self.get_data_before.append(np.average(vec_app1))
                    self.avg_data1 = np.average(self.get_data_before)
                    self.canvas.itemconfig(self.frequency_before, text = f' {int(self.avg_data1):,} Hz')
                    self.canvas.itemconfig(self.show_result, text = '')
                if self.status_collect_data_after:
                    self.get_data_after.append(np.average(vec_app1))
                    self.avg_data2 = np.average(self.get_data_after)
                    self.canvas.itemconfig(self.frequency_after, text = f' {int(self.avg_data2):,} Hz')
                    self.canvas.itemconfig(self.show_result, text = '')
                
        self.serial.close()

    def baseline_estimation(self, x, y, poly_order):
        coeffs = np.polyfit(x, y, poly_order)
        poly_fitted = np.polyval(coeffs, x) 
        return poly_fitted, coeffs       

    def baseline_correction(self, readFREQ, data_mag):
        (self._polyfitted_all, self._coeffs_all) = self.baseline_estimation(readFREQ, data_mag, 8)
        
        self._mag_beseline_corrected_all = data_mag - self._polyfitted_all
        return self._mag_beseline_corrected_all
    
    def FindPeak(self, freq, mag, dist):
        self.max_indexes_mag = scipy.signal.argrelextrema(np.array(mag), comparator = np.greater, order = dist)[0]
        self.max_freq_mag = np.array(freq)[self.max_indexes_mag]
        self.max_value_mag = np.array(mag)[self.max_indexes_mag]
        return self.max_value_mag
    
    def savitzky_golay(self, y, window_size, order, deriv=0, rate=1):
        import numpy as np
        from math import factorial
        try:
            window_size = np.abs(int(window_size))
            order = np.abs(int(order)) 
        except ValueError as msg:
            raise ValueError("WARNING: window size and order have to be of type int!")
        if window_size % 2 != 1 or window_size < 1:
            raise TypeError("WARNING: window size must be a positive odd number!")
        if window_size < order + 2:
            raise TypeError("WARNING: window size is too small for the polynomials order!")
        order_range = range(order+1)
        half_window = (window_size -1) // 2
        # precompute coefficients
        b = np.mat([[k**i for i in order_range] for k in range(-half_window, half_window+1)])
        m = np.linalg.pinv(b).A[deriv] * rate**deriv * factorial(deriv)
        # pad the signal at the extremes with values taken from the signal itself
        firstvals = y[0] - np.abs( y[1:half_window+1][::-1] - y[0] )
        lastvals = y[-1] + np.abs(y[-half_window-1:-1][::-1] - y[-1])
        y = np.concatenate((firstvals, y, lastvals))
        return np.convolve( m[::-1], y, mode='valid')
    
    def cal_measure(self):
        if self.check_page == 'measure':
            self.check_page = 'cal'
            self.b_QCM.place_forget()
            #<57
            x = int((889/1536*self.w))
            y = int((495/864*self.h))
            w = int((55.0/1536*self.w))
            h = int((59.0/864*self.h))
            self.m_pause = Button(self, image = self.img_m_pause, borderwidth=0,
                               highlightthickness=0, command=lambda: self.change_status_measurement('Pause'),
                               relief="flat", activebackground='#EBF4FF', background='#EBF4FF')
            self.m_pause.place(x=x, y=y, width=w, height=h)

            x = int((946/1536*self.w))
            y = int((495/864*self.h))
            w = int((55.0/1536*self.w))
            h = int((59.0/864*self.h))
            self.m_start = Button(self, image = self.img_m_start, borderwidth=0,
                               highlightthickness=0, command=lambda: self.change_status_measurement('Start'),
                               relief="flat", activebackground='#EBF4FF', background='#EBF4FF')
            self.m_start.place(x=x, y=y, width=w, height=h)

            x = int((586/1536*self.w))
            y = int((509/864*self.h))
            w = int((32.0/1536*self.w))
            h = int((37.0/864*self.h))
            self.b_view1 = Button(self, image = self.view1_clicked, borderwidth=0,
                                highlightthickness=0, command=lambda: self.change_page('A'), relief="flat",
                                activebackground='#EBF4FF', background='#EBF4FF')
            self.b_view1.place(x=x, y=y, width=w, height=h)

            x = int((620/1536*self.w))
            y = int((509/864*self.h))
            w = int((32.0/1536*self.w))
            h = int((37.0/864*self.h))
            self.b_view2 = Button(self, image = self.view2_hold, borderwidth=0,
                                highlightthickness=0, command=lambda: self.change_page('B'), relief="flat",
                                activebackground='#EBF4FF', background='#EBF4FF')
            self.b_view2.place(x=x, y=y, width=w, height=h)

            self.b_measurement.config(image = self.calibration_green)
            self.gt.clear()
            self.gt.grid(True)
            self.gt.set_title('Measurement\n', fontdict = self.font1) 
            self.gt.set_xlabel('\nTime (s)', fontdict = self.font2)
            self.gt.set_ylabel('Resonance Frequency (MHz)', fontdict = self.font2)
            self.line1.draw()

        elif self.check_page == 'cal':
            #self.canvas.itemconfig(self.frequency_extension, text = '')
            #self.m_stop.place_forget()
            self.m_pause.place_forget()
            self.m_start.place_forget()
            #self.combo.place_forget()
            self.b_view1.place_forget()
            self.b_view2.place_forget()

            x = int((871/1536*self.w))
            y = int((494/864*self.h))
            w = int((137.0/1536*self.w))
            h = int((64.0/864*self.h))
            self.b_QCM = Button(self, image = self.QCM_green, borderwidth=0,
                               highlightthickness=0, command=lambda: self.change_status_calibration(),
                               relief="flat", activebackground='#EBF4FF', background='#EBF4FF')
            self.b_QCM.place(x=x, y=y, width=w, height=h)

            self.b_measurement.config(image = self.measurement_green)
            self.gt.clear()
            self.gt.grid(True)
            self.gt.set_title('Calibration\n', fontdict = self.font1) 
            self.gt.set_xlabel('\nFrequency (MHz)', fontdict = self.font2)
            self.gt.set_ylabel('Amplitude (dB)\n', fontdict = self.font2)
            if len(self.base_line) > 0:
                self.check_page = 'measure'
                self.canvas.itemconfig(self.image_2, image = self.c_green)
                self.gt.plot(self.xf, self.base_line, color = 'blue')
                self.gt.set_xlim([8, 12])
            self.line1.draw()
        else:
            messagebox.showwarning(title = 'Warning', message = 'Please calibration')

    def call_directory(self, var):
        try:
            name_entry_ = filedialog.askdirectory()
            if var == 'measuring':
                self.directory_var.set(name_entry_)
            else:
                self.directory_bc_var.set(name_entry_)
        except Exception as e:
            print('call directory error : ', e)
    
    def call_save_csv_file(self, var):
        if var == 'measuring':
            if self.name_var.get() != '':
                if self.directory_var.get() != '':
                    if len(self.freq_range_mean) > 1:
                        fields = ['Count','Time', 'Resonance_Frequency (Hz)']
                        with open(self.directory_var.get()+'/'+self.name_var.get()+'.csv', 'w', newline='') as file: 
                            writer = csv.DictWriter(file, fieldnames = fields)
                            writer.writeheader()
                            for i in range(len(self.freq_range_mean)-1):
                                writer.writerows([{'Count' : i+1,
                                                'Time' : self.time_plot[i+1],
                                                'Resonance_Frequency (Hz)' : self.freq_range_mean[i+1]}])
                                #writer.writerows([{'Relative_time' : self.time_plot[i], 'Resonance_Frequency' : self.freq_range_mean[i]}])
                            messagebox.showwarning(title = 'Complete', message = 'Saved successfully.')
                        pass
                    else:
                        messagebox.showwarning(title = 'Warning', message = 'Please take measurements.')
                else:
                    messagebox.showwarning(title = 'Warning', message = 'Please select a folder to save the file.')
            else:
                messagebox.showwarning(title = 'Warning', message = 'Please specify file name.')
        else:
            if self.check_page == 'measure':
                if self.save_bc_var.get() != '':
                    if self.directory_bc_var.get() != '':
                        if len(self.raw_data) > 2:
                            fields = ['xf','data', 'baseline', 'coefficial']
                            with open(self.directory_bc_var.get()+'/'+self.save_bc_var.get()+'.csv', 'w', newline='') as file:
                                writer = csv.DictWriter(file, fieldnames = fields)
                                writer.writeheader()
                                for i in range(len(self.raw_data)):
                                    writer.writerows([{'xf' : self.xf[i] if i < len(self.xf) else None,
                                                        'data' : self.raw_data[i] if i < len(self.raw_data) else None,
                                                        'baseline' : self.base_line[i] if i < len(self.base_line) else None,
                                                        'coefficial' : self._coeffs_all[i] if i < len(self._coeffs_all) else None}])
                            messagebox.showwarning(title = 'Complete', message = 'Saved successfully.')
                        else:
                            messagebox.showwarning(title = 'Warning', message = 'Please calibrate.')
                    else:
                        messagebox.showwarning(title = 'Warning', message = 'Please select a folder to save the file.')
                else:
                    messagebox.showwarning(title = 'Warning', message = 'Please specify file name.')
            else:
                messagebox.showwarning(title = 'Warning', message = 'Please calibrate.')
    
    def call_csv_file1(self, var):
        try:
            files = [('CSV Files', '*.csv')]
            csvfile_save = askopenfilename(filetypes = files)            
            if var == 'before' or var == 'after':
                get_value = []
                i = 0
                with open(csvfile_save, 'r', newline='') as file:
                    spamreader = csv.reader(file, delimiter = ' ', quotechar = '|')
                    for row in spamreader:
                        value = row[0].split(',')
                        if i > 0:
                            get_value.append(float(value[2]))
                        i+=1
                self.avg_data = np.average(get_value)
                if var == 'before':
                    self.avg_data1 = self.avg_data
                    self.canvas.itemconfig(self.frequency_before, text = f' {int(self.avg_data1):,} Hz')
                elif var == 'after':
                    self.avg_data2 = self.avg_data
                    self.canvas.itemconfig(self.frequency_after, text = f' {int(self.avg_data2):,} Hz')
            else:
                rename = csvfile_save.split('/')
                self.open_bc_var.set(rename[-1])
                with open(csvfile_save, mode ='r') as file:
                    csvFile = csv.reader(file)
                    next(csvFile)
                    
                    self.xf = []
                    self.raw_data = []
                    self.base_line = []
                    self._coeffs_all = []
                    for i, row in enumerate(csvFile):
                        self.xf.append(float(row[0]))
                        self.raw_data.append(float(row[1]))
                        self.base_line.append(float(row[2]))
                        if i < 9:
                            self._coeffs_all.append(float(row[3]))
                self.canvas.itemconfig(self.image_2, image = self.c_green)
                self.b_measurement.config(image = self.measurement_green)
                self.check_page = 'measure'

                self.xf_ = np.linspace(8_000_000, 12_000_000, len(self.base_line))
                self.FindPeak(self.xf_, self.base_line, 4000)

                self.gt.clear()
                self.gt.grid(True)
                self.gt.set_title('Calibration\n', fontdict = self.font1) 
                self.gt.set_xlabel('\nFrequency (MHz)', fontdict = self.font2)
                self.gt.set_ylabel('Amplitude (dB)\n', fontdict = self.font2)
                self.gt.plot(self.xf, self.base_line, color = 'blue')
                self.gt.set_xlim([8, self.xf[-1]])
                self.line1.draw()
        except Exception as e:
            print('Open file error : ', e)

    def collect_data_before(self):
        if not self.status_collect_data_before and self.variable_status_measurement:
            self.collect_data1.config(image = self.collect_stop)
            self.status_collect_data_before = True
            self.get_data_before = []
        else:
            self.collect_data1.config(image = self.collect_start)
            self.status_collect_data_before = False

    def collect_data_after(self):
        if not self.status_collect_data_after and self.variable_status_measurement:
            self.collect_data2.config(image = self.collect_stop)
            self.status_collect_data_after = True
            self.get_data_after = []
        else:
            self.collect_data2.config(image = self.collect_start)
            self.status_collect_data_after = False
    
    def collect_data_refresh(self, var):
        if var == 'before':
            self.get_data_before = []
            self.canvas.itemconfig(self.frequency_before, text = ' --,---,--- Hz')
            self.canvas.itemconfig(self.show_result, text = '')
        else:
            self.get_data_after = []
            self.canvas.itemconfig(self.frequency_after, text = ' --,---,--- Hz')
            self.canvas.itemconfig(self.show_result, text = '')

    def call_result(self):
        if self.avg_data1 != 0 and self.avg_data2 != 0:
            delta = self.avg_data1 - self.avg_data2
            self.canvas.itemconfig(self.frequency_delta, text = f' {int(delta):,} ')
            if delta > self.threshold_var.get():
                self.canvas.itemconfig(self.show_result, text = 'Detected', fill = 'red')
            else:
                self.canvas.itemconfig(self.show_result, text = 'Not Detected', fill = 'black')
        else:
            messagebox.showwarning(title = 'Warning', message = 'Please collect the data')
        

if __name__ == "__main__":
    app = Main_Home()
    app.resizable(False, False)
    #app.state('zoom')
    app.wm_iconbitmap(default=relative_to_assets("icon.ico"))
    w = int(app.winfo_width() / 3.5)
    s = 'QCM Monitor T.S. v4.1 GUI. V.3.0.2'.rjust(w//2)
    app.title(s)
    app.protocol("WM_DELETE_WINDOW", on_closing)
    app.mainloop()
