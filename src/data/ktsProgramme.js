/**
 * KTS Programme Catalogue — source of truth from
 * KTS-Labs-and-Academic-Courses-EN.docx
 * Do not invent titles, counts, or durations.
 */

export const KTS_LABS = [
  {
    id: "lab-1",
    code: "Lab 1",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "Activity",
    title: {
      en: "QCM Biosensor & Biomarker Detection",
      th: "ไบโอเซนเซอร์ QCM และการตรวจหาไบโอมาร์กเกอร์",
    },
    subtitle: {
      en: "Mass-Sensitive Detection on a Quartz Crystal",
      th: "การตรวจวัดมวลบนผลึกควอตซ์",
    },
    desc: {
      en: "Start with the platform Surazense built its research on. Students calibrate a Quartz Crystal Microbalance, sweep 8–12 MHz through an ESP32 readout, functionalize the gold surface, then watch a biomarker bind in real time and decide whether the target is present.",
      th: "เริ่มจากแพลตฟอร์มที่ Surazense ใช้ในงานวิจัยของตนเอง นักเรียนสอบเทียบ Quartz Crystal Microbalance กวาดความถี่ 8–12 MHz ผ่านการอ่านค่าด้วย ESP32 ปรับสภาพพื้นผิวทอง แล้วสังเกตการจับของไบโอมาร์กเกอร์แบบเรียลไทม์เพื่อตัดสินว่ามีเป้าหมายหรือไม่",
    },
    skills: {
      en: [
        "Frequency sweep & resonance tracking",
        "Gold surface functionalization",
        "Reading a real binding curve",
      ],
      th: [
        "การกวาดความถี่และการติดตามเรโซแนนซ์",
        "การปรับสภาพพื้นผิวทอง",
        "การอ่านเส้นโค้งการจับจริง",
      ],
    },
  },
  {
    id: "lab-2",
    code: "Lab 2",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "Waves",
    title: {
      en: "SAW Biosensor & Biomarker Detection",
      th: "ไบโอเซนเซอร์ SAW และการตรวจหาไบโอมาร์กเกอร์",
    },
    subtitle: {
      en: "Surface Acoustic Wave Sensing",
      th: "การตรวจวัดด้วยคลื่นเสียงผิว",
    },
    desc: {
      en: "Same biomarker, different physics. Here the wave travels across the surface instead of through the bulk crystal. Students drive a SAW device, record phase and amplitude as the target binds, and compare sensitivity directly against their Lab 1 result.",
      th: "ไบโอมาร์กเกอร์เดียวกัน แต่หลักฟิสิกส์ต่างกัน คลื่นเดินทางบนพื้นผิวแทนการผ่านผลึก นักเรียนขับอุปกรณ์ SAW บันทึกเฟสและแอมพลิจูดขณะเป้าหมายจับ และเปรียบเทียบความไวกับผล Lab 1 โดยตรง",
    },
    skills: {
      en: [
        "SAW device operation",
        "Phase vs amplitude readout",
        "Cross-platform sensitivity comparison",
      ],
      th: [
        "การใช้งานอุปกรณ์ SAW",
        "การอ่านค่าเฟสเทียบแอมพลิจูด",
        "การเปรียบเทียบความไวข้ามแพลตฟอร์ม",
      ],
    },
  },
  {
    id: "lab-3",
    code: "Lab 3",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "Cpu",
    title: {
      en: "FET Biosensor & Biomarker Detection",
      th: "ไบโอเซนเซอร์ FET และการตรวจหาไบโอมาร์กเกอร์",
    },
    subtitle: {
      en: "Charge-Based Detection & Screening Effects",
      th: "การตรวจวัดด้วยประจุและปรากฏการณ์สกรีนนิ่ง",
    },
    desc: {
      en: "Detect a molecule by the charge it carries rather than the mass it adds. Students bias a field-effect transistor biosensor, track how the transfer curve shifts as the target binds, and test how buffer ionic strength changes what the sensor can still see.",
      th: "ตรวจโมเลกุลจากประจุที่มันพก ไม่ใช่มวลที่เพิ่ม นักเรียนไบแอสไบโอเซนเซอร์ทรานซิสเตอร์สนามไฟฟ้า ติดตามการเลื่อนของเส้นโค้งถ่ายโอนเมื่อเป้าหมายจับ และทดสอบว่าความเข้มไอออนของบัฟเฟอร์เปลี่ยนสิ่งที่เซนเซอร์ยังมองเห็นได้อย่างไร",
    },
    skills: {
      en: [
        "FET transfer-curve measurement",
        "Gate bias & threshold shift",
        "Ionic strength (Debye) effects",
      ],
      th: [
        "การวัดเส้นโค้งถ่ายโอนของ FET",
        "เกตไบแอสและการเลื่อนธรณีประตู",
        "ผลของความเข้มไอออน (Debye)",
      ],
    },
  },
  {
    id: "lab-4",
    code: "Lab 4",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "BatteryCharging",
    title: {
      en: "Portable Electrochemical Sensor & Biomarker Detection",
      th: "เซนเซอร์เคมีไฟฟ้าแบบพกพาและการตรวจหาไบโอมาร์กเกอร์",
    },
    subtitle: {
      en: "Resistance Readout on Screen-Printed Electrodes",
      th: "การอ่านค่าความต้านทานบนอิเล็กโทรดพิมพ์สกรีน",
    },
    desc: {
      en: "Build a detector that fits in a pocket. Students assemble a screen-printed electrode cell and read one quantity only — electrical resistance — as the biomarker binds to the electrode surface. Rising resistance means more target captured, and their own calibration curve turns ohms into a concentration.",
      th: "สร้างเครื่องตรวจที่ใส่กระเป๋าได้ นักเรียนประกอบเซลล์อิเล็กโทรดพิมพ์สกรีนและอ่านเพียงค่าความต้านทานไฟฟ้า เมื่อไบโอมาร์กเกอร์จับที่ผิวอิเล็กโทรด ความต้านทานที่สูงขึ้นหมายถึงจับเป้าหมายได้มากขึ้น และเส้นโค้งสอบเทียบของตนเองแปลงโอห์มเป็นความเข้มข้น",
    },
    skills: {
      en: [
        "Screen-printed electrode setup",
        "Resistance readout & baseline stability",
        "Calibration curve & detection limit",
      ],
      th: [
        "การตั้งค่าอิเล็กโทรดพิมพ์สกรีน",
        "การอ่านความต้านทานและความเสถียรเส้นฐาน",
        "เส้นโค้งสอบเทียบและขีดจำกัดการตรวจวัด",
      ],
    },
  },
  {
    id: "lab-5",
    code: "Lab 5",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "Dna",
    title: {
      en: "Sensor Regeneration, Reuse & DNA Dehybridization",
      th: "การฟื้นฟูเซนเซอร์ การใช้ซ้ำ และการแยกคู่ DNA",
    },
    subtitle: {
      en: "How Many Times Can One Chip Be Used?",
      th: "ชิปหนึ่งชิ้นใช้ซ้ำได้กี่ครั้ง?",
    },
    desc: {
      en: "Ask the question that decides whether a test kit is disposable or reusable. Students hybridize DNA onto the sensor, strip it off again by raising temperature and changing buffer, then repeat the cycle and measure how much signal survives each round.",
      th: "ตั้งคำถามที่ตัดสินว่าชุดตรวจใช้แล้วทิ้งหรือใช้ซ้ำได้ นักเรียนไฮบริดิเซ DNA บนเซนเซอร์ ลอกออกด้วยการเพิ่มอุณหภูมิและเปลี่ยนบัฟเฟอร์ แล้ววนซ้ำและวัดว่าสัญญาณเหลือเท่าใดในแต่ละรอบ",
    },
    skills: {
      en: [
        "DNA hybridization & dehybridization",
        "Temperature and buffer control",
        "Cycle reproducibility (%CV)",
      ],
      th: [
        "การไฮบริดิเซและแยกคู่ DNA",
        "การควบคุมอุณหภูมิและบัฟเฟอร์",
        "ความทำซ้ำได้ของรอบ (%CV)",
      ],
    },
  },
  {
    id: "lab-6",
    code: "Lab 6",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "Box",
    title: {
      en: "Biosensor Modeling & Simulation with CAD",
      th: "การจำลองแบบไบโอเซนเซอร์ด้วย CAD",
    },
    subtitle: {
      en: "Engineering Design Before Fabrication",
      th: "ออกแบบทางวิศวกรรมก่อนการผลิต",
    },
    desc: {
      en: "Design the sensor before building it. Students draw electrode and flow-cell geometry in CAD, simulate how mass loading and liquid flow affect the signal, sweep dimensions to find what improves sensitivity, and export a file ready for 3D printing.",
      th: "ออกแบบเซนเซอร์ก่อนสร้าง นักเรียนวาดรูปทรงอิเล็กโทรดและโฟลว์เซลล์ใน CAD จำลองผลของมวลและไหลของของเหลวต่อสัญญาณ กวาดขนาดเพื่อหาสิ่งที่เพิ่มความไว และส่งออกไฟล์พร้อมพิมพ์ 3 มิติ",
    },
    skills: {
      en: [
        "CAD electrode & flow-cell design",
        "Mass-loading and flow simulation",
        "Parameter sweep & design optimization",
      ],
      th: [
        "การออกแบบอิเล็กโทรดและโฟลว์เซลล์ด้วย CAD",
        "การจำลองมวลโหลดและการไหล",
        "การกวาดพารามิเตอร์และปรับการออกแบบ",
      ],
    },
  },
  {
    id: "lab-7",
    code: "Lab 7",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "Sparkles",
    title: {
      en: "Bio-Design Website with AI",
      th: "เว็บไซต์ Bio-Design พร้อม AI",
    },
    subtitle: {
      en: "Publishing Live Sensor Data",
      th: "เผยแพร่ข้อมูลเซนเซอร์แบบสด",
    },
    desc: {
      en: "Turn a working sensor into something other people can use. Students build a web dashboard that receives live readings from their device, connect an AI assistant that explains a result in plain language, and publish the page for their school to try.",
      th: "เปลี่ยนเซนเซอร์ที่ทำงานได้ให้ผู้อื่นใช้ได้ นักเรียนสร้างแดชบอร์ดเว็บที่รับค่าอ่านสดจากอุปกรณ์ เชื่อมผู้ช่วย AI ที่อธิบายผลเป็นภาษาเข้าใจง่าย และเผยแพร่หน้าให้โรงเรียนทดลองใช้",
    },
    skills: {
      en: [
        "Live data dashboard build",
        "AI assistant integration via API",
        "Publishing & user testing",
      ],
      th: [
        "การสร้างแดชบอร์ดข้อมูลสด",
        "การเชื่อมผู้ช่วย AI ผ่าน API",
        "การเผยแพร่และการทดสอบผู้ใช้",
      ],
    },
  },
  {
    id: "lab-8",
    code: "Lab 8",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "HeartPulse",
    title: {
      en: "Wearable Vital-Sign Sensing",
      th: "การตรวจสัญญาณชีพด้วยอุปกรณ์สวมใส่",
    },
    subtitle: {
      en: "PPG, Sampling Rate & Motion Artifacts",
      th: "PPG อัตราการสุ่มตัวอย่าง และสัญญาณรบกวนจากการเคลื่อนไหว",
    },
    desc: {
      en: "Build a working heart-rate monitor, then find out why it fails. Students wire a PPG sensor to an ESP32, choose a sampling rate, and separate a real pulse from the artifacts that appear the moment the wearer moves.",
      th: "สร้างเครื่องวัดอัตราหัวใจที่ใช้งานได้ แล้วหาสาเหตุที่มันล้มเหลว นักเรียนต่อเซนเซอร์ PPG กับ ESP32 เลือกอัตราการสุ่มตัวอย่าง และแยกชีพจรจริงออกจากสัญญาณรบกวนเมื่อผู้สวมใส่ขยับ",
    },
    skills: {
      en: [
        "PPG signal acquisition",
        "Sampling rate selection",
        "Motion artifact rejection",
      ],
      th: [
        "การเก็บสัญญาณ PPG",
        "การเลือกอัตราการสุ่มตัวอย่าง",
        "การตัดสัญญาณรบกวนจากการเคลื่อนไหว",
      ],
    },
  },
  {
    id: "lab-9",
    code: "Lab 9",
    hours: "40 hours",
    hoursTh: "40 ชั่วโมง",
    group: 1,
    icon: "Footprints",
    title: {
      en: "Smart Insole & Fall Detection",
      th: "แผ่นรองเท้าอัจฉริยะและการตรวจจับการล้ม",
    },
    subtitle: {
      en: "Fall Detection & Gait Analysis Technology",
      th: "เทคโนโลยีตรวจจับการล้มและการวิเคราะห์การเดิน",
    },
    desc: {
      en: "Learn the technology behind fall detection and pressure-based gait analysis. Students read pressure distribution across the foot from a sensing insole, follow how an accelerometer signal separates a real fall from ordinary movement, and interpret gait from their own recorded walks — stride timing, weight transfer, and left–right balance.",
      th: "เรียนรู้เทคโนโลยีหลังการตรวจจับการล้มและการวิเคราะห์การเดินจากความดัน นักเรียนอ่านการกระจายความดันบนฝ่าเท้าจากแผ่นรองเท้าเซนเซอร์ ติดตามว่าสัญญาณความเร่งแยกการล้มจริงจากการเคลื่อนไหวทั่วไปได้อย่างไร และแปลการเดินจากบันทึกของตนเอง — จังหวะก้าว การถ่ายน้ำหนัก และสมดุลซ้าย–ขวา",
    },
    skills: {
      en: [
        "Reading a foot pressure map",
        "Fall detection from accelerometer signals",
        "Gait pattern & balance interpretation",
      ],
      th: [
        "การอ่านแผนที่ความดันฝ่าเท้า",
        "การตรวจจับการล้มจากสัญญาณความเร่ง",
        "การแปลรูปแบบการเดินและสมดุล",
      ],
    },
  },
  {
    id: "lab-10",
    code: "Lab 10",
    hours: "20 hours",
    hoursTh: "20 ชั่วโมง",
    group: 2,
    icon: "Shield",
    title: {
      en: "Lab Safety, Pipetting & Solution Prep",
      th: "ความปลอดภัยในแล็บ การปิเปต และการเตรียมสารละลาย",
    },
    subtitle: {
      en: "Prerequisite for All Wet Labs",
      th: "วิชาบังคับก่อนแล็บเปียกทั้งหมด",
    },
    desc: {
      en: "Enter the lab safely and measure accurately. Students cover BSL-1/2 practice and waste handling, verify micropipette accuracy by mass, and prepare buffers from molarity calculations and serial dilutions.",
      th: "เข้าแล็บอย่างปลอดภัยและวัดได้อย่างแม่นยำ นักเรียนเรียนแนวปฏิบัติ BSL-1/2 และการจัดการของเสีย ตรวจความแม่นยำไมโครปิเปตด้วยมวล และเตรียมบัฟเฟอร์จากโมลาริตีและการเจือจางแบบอนุกรม",
    },
    skills: {
      en: [
        "PPE and waste protocols",
        "Micropipette accuracy checks",
        "Molarity & serial dilution",
      ],
      th: [
        "PPE และระเบียบของเสีย",
        "การตรวจความแม่นยำไมโครปิเปต",
        "โมลาริตีและการเจือจางแบบอนุกรม",
      ],
    },
  },
  {
    id: "lab-11",
    code: "Lab 11",
    hours: "20 hours",
    hoursTh: "20 ชั่วโมง",
    group: 2,
    icon: "FlaskConical",
    title: {
      en: "PCR & Gel Electrophoresis",
      th: "PCR และเจลอิเล็กโทรโฟรีซิส",
    },
    subtitle: {
      en: "Amplify, Separate, Interpret",
      th: "ขยาย แยก และแปลผล",
    },
    desc: {
      en: "Amplify a target sequence and read the result. Students set up reactions and thermal cycling, cast and run an agarose gel, then size bands against a ladder and judge whether the result is trustworthy.",
      th: "ขยายลำดับเป้าหมายและอ่านผล นักเรียนตั้งปฏิกิริยาและเทอร์มอลไซเคิล เทและรันเจลอะกาโรส แล้ววัดขนาดแบนด์เทียบแลดเดอร์และตัดสินว่าผลน่าเชื่อถือหรือไม่",
    },
    skills: {
      en: [
        "Reaction setup & thermal cycling",
        "Agarose gel casting and running",
        "Band sizing & contamination controls",
      ],
      th: [
        "การตั้งปฏิกิริยาและเทอร์มอลไซเคิล",
        "การเทและรันเจลอะกาโรส",
        "การวัดขนาดแบนด์และการควบคุมการปนเปื้อน",
      ],
    },
  },
  {
    id: "lab-12",
    code: "Lab 12",
    hours: "20 hours",
    hoursTh: "20 ชั่วโมง",
    group: 2,
    icon: "TestTube",
    title: {
      en: "Protein Quantification & ELISA",
      th: "การหาปริมาณโปรตีนและ ELISA",
    },
    subtitle: {
      en: "Standard Curves & Detection Limits",
      th: "เส้นโค้งมาตรฐานและขีดจำกัดการตรวจวัด",
    },
    desc: {
      en: "Turn color into a number. Students build a protein standard curve, run a sandwich ELISA on a microplate, read absorbance, and calculate the assay's limit of detection from their own blanks.",
      th: "เปลี่ยนสีเป็นตัวเลข นักเรียนสร้างเส้นโค้งมาตรฐานโปรตีน รันแซนด์วิช ELISA บนไมโครเพลต อ่านค่าดูดกลืนแสง และคำนวณขีดจำกัดการตรวจวัดจากแบลงก์ของตนเอง",
    },
    skills: {
      en: [
        "Standard curve construction",
        "Sandwich ELISA workflow",
        "Limit of detection calculation",
      ],
      th: [
        "การสร้างเส้นโค้งมาตรฐาน",
        "ขั้นตอนแซนด์วิช ELISA",
        "การคำนวณขีดจำกัดการตรวจวัด",
      ],
    },
  },
  {
    id: "lab-13",
    code: "Lab 13",
    hours: "20 hours",
    hoursTh: "20 ชั่วโมง",
    group: 2,
    icon: "Microscope",
    title: {
      en: "Microscopy & Cell Viability",
      th: "กล้องจุลทรรศน์และความมีชีวิตของเซลล์",
    },
    subtitle: {
      en: "Counting, Staining, Judging Health",
      th: "นับ ย้อม และประเมินสุขภาพเซลล์",
    },
    desc: {
      en: "See the sample instead of only measuring it. Students prepare stained slides, count cells on a hemocytometer, and use trypan blue exclusion to report viability with a defensible number.",
      th: "เห็นตัวอย่าง ไม่ใช่แค่วัดค่า นักเรียนเตรียมสไลด์ที่ย้อมแล้ว นับเซลล์บนฮีโมไซโตมิเตอร์ และใช้ trypan blue exclusion เพื่อรายงานความมีชีวิตด้วยตัวเลขที่อธิบายได้",
    },
    skills: {
      en: [
        "Slide preparation & staining",
        "Hemocytometer counting",
        "Trypan blue viability assay",
      ],
      th: [
        "การเตรียมสไลด์และการย้อม",
        "การนับด้วยฮีโมไซโตมิเตอร์",
        "แอสเซย์ความมีชีวิตด้วย trypan blue",
      ],
    },
  },
];

export const KTS_COURSES = [
  {
    id: "course-1",
    code: "Course 1",
    hours: "3 hours",
    hoursTh: "3 ชั่วโมง",
    icon: "BookOpen",
    title: {
      en: "Principles of Biosensing & Transduction",
      th: "หลักการไบโอเซนซิงและการแปลงสัญญาณ",
    },
    subtitle: {
      en: "Acoustic, FET & Electrochemical Platforms",
      th: "แพลตฟอร์มอะคูสติก FET และเคมีไฟฟ้า",
    },
    desc: {
      en: "Understand how a molecular event becomes an electrical signal — across all four platforms used in Labs 1 to 4. Covers the Sauerbrey relation, charge screening in solution, charge-transfer resistance, and how sensitivity, selectivity and limit of detection are defined and compared.",
      th: "เข้าใจว่าเหตุการณ์ระดับโมเลกุลกลายเป็นสัญญาณไฟฟ้าได้อย่างไร — ครอบคลุมสี่แพลตฟอร์มใน Labs 1 ถึง 4 รวมความสัมพันธ์ Sauerbrey การสกรีนประจุในสารละลาย ความต้านทานถ่ายโอนประจุ และการนิยามเปรียบเทียบความไว ความจำเพาะ และขีดจำกัดการตรวจวัด",
    },
    skills: {
      en: [
        "Four transduction families compared",
        "Sauerbrey relation & Debye length",
        "Sensitivity, selectivity & LOD",
      ],
      th: [
        "เปรียบเทียบสี่ตระกูลการแปลงสัญญาณ",
        "ความสัมพันธ์ Sauerbrey และความยาว Debye",
        "ความไว ความจำเพาะ และ LOD",
      ],
    },
  },
  {
    id: "course-2",
    code: "Course 2",
    hours: "3 hours",
    hoursTh: "3 ชั่วโมง",
    icon: "Dna",
    title: {
      en: "Molecular Diagnostics Fundamentals",
      th: "พื้นฐานการวินิจฉัยระดับโมเลกุล",
    },
    subtitle: {
      en: "Biomarkers, Targets & Test Performance",
      th: "ไบโอมาร์กเกอร์ เป้าหมาย และสมรรถนะของชุดตรวจ",
    },
    desc: {
      en: "Learn what a diagnostic test actually claims. Students work through biomarker classes — protein, nucleic acid, metabolite — how a target and sample type are chosen, and how sensitivity, specificity and predictive value are calculated from a real 2×2 result table.",
      th: "เรียนรู้ว่าชุดตรวจวินิจฉัยอ้างอะไรจริง ๆ นักเรียนศึกษาชั้นของไบโอมาร์กเกอร์ — โปรตีน กรดนิวคลีอิก เมแทบอไลต์ — การเลือกเป้าหมายและชนิดตัวอย่าง และการคำนวณความไว ความจำเพาะ และค่าทำนายจากตารางผล 2×2 จริง",
    },
    skills: {
      en: [
        "Biomarker classes & sample types",
        "Target selection criteria",
        "Sensitivity, specificity & predictive value",
      ],
      th: [
        "ชั้นไบโอมาร์กเกอร์และชนิดตัวอย่าง",
        "เกณฑ์การเลือกเป้าหมาย",
        "ความไว ความจำเพาะ และค่าทำนาย",
      ],
    },
  },
  {
    id: "course-3",
    code: "Course 3",
    hours: "3 hours",
    hoursTh: "3 ชั่วโมง",
    icon: "Stethoscope",
    title: {
      en: "Basic Translational Medicine",
      th: "การแพทย์ปริวรรตเบื้องต้น",
    },
    subtitle: {
      en: "From Bench to Bedside",
      th: "จากโต๊ะทดลองสู่เตียงผู้ป่วย",
    },
    desc: {
      en: "Follow an idea through the stages that decide whether it ever reaches a patient: preclinical evidence, prototype validation, clinical study phases, regulatory approval and cost. Case studies show where promising sensors stop, and why that is usually not a science problem.",
      th: "ติดตามไอเดียผ่านขั้นที่ตัดสินว่าจะถึงผู้ป่วยหรือไม่: หลักฐานพรีคลินิก การตรวจสอบต้นแบบ ระยะการศึกษาคลินิก การอนุมัติกำกับดูแล และต้นทุน กรณีศึกษาแสดงว่าเซนเซอร์ที่มีศักยภาพหยุดที่ใด และเหตุใดมักไม่ใช่ปัญหาทางวิทยาศาสตร์",
    },
    skills: {
      en: [
        "Translational stages T0–T4",
        "Prototype validation requirements",
        "Regulatory, cost & adoption barriers",
      ],
      th: [
        "ขั้นปริวรรต T0–T4",
        "ข้อกำหนดการตรวจสอบต้นแบบ",
        "อุปสรรคด้านกำกับดูแล ต้นทุน และการนำไปใช้",
      ],
    },
  },
  {
    id: "course-4",
    code: "Course 4",
    hours: "3 hours",
    hoursTh: "3 ชั่วโมง",
    icon: "HeartPulse",
    title: {
      en: "Liquid Biopsy & Cancer Screening",
      th: "ลิควิดไบอปซีและการคัดกรองมะเร็ง",
    },
    subtitle: {
      en: "Cell-Free DNA, RNA & Population Screening",
      th: "cfDNA, RNA และการคัดกรองประชากร",
    },
    desc: {
      en: "The clinical case behind Labs 1 to 5. Covers cell-free DNA and RNA in circulation, why a single blood draw can carry tumour information, HPV and cervical cancer screening as a worked example, and what a screening programme must prove before a country adopts it.",
      th: "กรณีคลินิกเบื้องหลัง Labs 1 ถึง 5 ครอบคลุม DNA และ RNA ไร้เซลล์ในกระแสเลือด เหตุใดการเจาะเลือดครั้งเดียวพกข้อมูลเนื้องอกได้ การคัดกรอง HPV และมะเร็งปากมดลูกเป็นตัวอย่าง และสิ่งที่โปรแกรมคัดกรองต้องพิสูจน์ก่อนประเทศนำไปใช้",
    },
    skills: {
      en: [
        "cfDNA/cfRNA biology",
        "HPV screening case study",
        "Evaluating a screening programme",
      ],
      th: [
        "ชีววิทยา cfDNA/cfRNA",
        "กรณีศึกษาการคัดกรอง HPV",
        "การประเมินโปรแกรมคัดกรอง",
      ],
    },
  },
  {
    id: "course-5",
    code: "Course 5",
    hours: "3 hours",
    hoursTh: "3 ชั่วโมง",
    icon: "Search",
    title: {
      en: "Literature Search & Screening",
      th: "การค้นและคัดกรองวรรณกรรม",
    },
    subtitle: {
      en: "PubMed, Scopus & Reference Management",
      th: "PubMed, Scopus และการจัดการเอกสารอ้างอิง",
    },
    desc: {
      en: "Find out what is already known before spending a single reagent. Students build Boolean queries in PubMed and Scopus, screen abstracts against their own inclusion criteria, and keep a citation library that stays clean to the end of the project.",
      th: "รู้ว่ามีอะไรรู้แล้วก่อนใช้รีเอเจนต์แม้แต่หนึ่งรายการ นักเรียนสร้างคิวรีบูลีนใน PubMed และ Scopus คัดกรองบทคัดย่อตามเกณฑ์ของตนเอง และรักษาคลังการอ้างอิงให้สะอาดจนจบโครงการ",
    },
    skills: {
      en: [
        "Boolean & MeSH search strategy",
        "Abstract screening criteria",
        "Reference manager workflow",
      ],
      th: [
        "กลยุทธ์ค้นบูลีนและ MeSH",
        "เกณฑ์คัดกรองบทคัดย่อ",
        "ขั้นตอนตัวจัดการเอกสารอ้างอิง",
      ],
    },
  },
  {
    id: "course-6",
    code: "Course 6",
    hours: "3 hours",
    hoursTh: "3 ชั่วโมง",
    icon: "FileText",
    title: {
      en: "Research Question & Proposal Design",
      th: "คำถามวิจัยและการออกแบบข้อเสนอ",
    },
    subtitle: {
      en: "Hypothesis, Variables, Controls",
      th: "สมมติฐาน ตัวแปร และการควบคุม",
    },
    desc: {
      en: "Turn curiosity into a workable plan. Students narrow a broad interest into a testable hypothesis, define variables and the controls that make a result believable, and write a one-page proposal with a realistic timeline and materials list.",
      th: "เปลี่ยนความอยากรู้เป็นแผนที่ใช้ได้ นักเรียนบีบความสนใจกว้างให้เป็นสมมติฐานที่ทดสอบได้ กำหนดตัวแปรและการควบคุมที่ทำให้ผลน่าเชื่อ และเขียนข้อเสนอหนึ่งหน้าพร้อมไทม์ไลน์และรายการวัสดุที่เป็นจริง",
    },
    skills: {
      en: [
        "Framing a testable hypothesis",
        "Variable & control definition",
        "One-page proposal writing",
      ],
      th: [
        "การตั้งสมมติฐานที่ทดสอบได้",
        "การนิยามตัวแปรและการควบคุม",
        "การเขียนข้อเสนอหนึ่งหน้า",
      ],
    },
  },
  {
    id: "course-7",
    code: "Course 7",
    hours: "4 hours",
    hoursTh: "4 ชั่วโมง",
    icon: "Code",
    title: {
      en: "Research Data Analysis in Python",
      th: "การวิเคราะห์ข้อมูลวิจัยด้วย Python",
    },
    subtitle: {
      en: "From Raw Sensor Log to Reportable Figure",
      th: "จากล็อกเซนเซอร์ดิบสู่รูปที่รายงานได้",
    },
    desc: {
      en: "Take the sensor logs recorded in Part 1 and analyze them properly. Students clean data with pandas, apply baseline correction and smoothing, fit curves, add error bars, and produce figures that hold up in a competition or a manuscript.",
      th: "นำล็อกเซนเซอร์ที่บันทึกใน Part 1 มาวิเคราะห์อย่างถูกต้อง นักเรียนทำความสะอาดข้อมูลด้วย pandas แก้เส้นฐานและปรับเรียบ ฟิตเส้นโค้ง ใส่แถบคลาดเคลื่อน และสร้างรูปที่ใช้ในการแข่งขันหรือต้นฉบับได้",
    },
    skills: {
      en: [
        "Data cleaning with pandas",
        "Baseline correction, smoothing & curve fitting",
        "Error bars & publication-quality plots",
      ],
      th: [
        "การทำความสะอาดข้อมูลด้วย pandas",
        "การแก้เส้นฐาน การปรับเรียบ และการฟิตเส้นโค้ง",
        "แถบคลาดเคลื่อนและกราฟคุณภาพตีพิมพ์",
      ],
    },
  },
  {
    id: "course-8",
    code: "Course 8",
    hours: "4 hours",
    hoursTh: "4 ชั่วโมง",
    icon: "Sparkles",
    title: {
      en: "AI for Research Projects",
      th: "AI สำหรับโครงการวิจัย",
    },
    subtitle: {
      en: "Using AI Honestly and Effectively",
      th: "ใช้ AI อย่างซื่อสัตย์และมีประสิทธิภาพ",
    },
    desc: {
      en: "Learn where AI genuinely helps a student research project and where it produces confident errors. Students use AI for literature triage, code assistance and figure drafting, verify every claim against a real source, and follow the disclosure rules competitions and journals now expect.",
      th: "เรียนรู้ว่า AI ช่วยโครงการวิจัยนักเรียนจริงตรงไหน และตรงไหนที่มันสร้างข้อผิดพลาดอย่างมั่นใจ นักเรียนใช้ AI คัดวรรณกรรม ช่วยโค้ด และร่างรูป ตรวจสอบทุกข้อความกับแหล่งจริง และปฏิบัติตามกฎเปิดเผยที่การแข่งขันและวารสารคาดหวัง",
    },
    skills: {
      en: [
        "Prompting for research tasks",
        "Verifying AI output against sources",
        "Disclosure & academic integrity rules",
      ],
      th: [
        "การเขียนพรอมต์สำหรับงานวิจัย",
        "การตรวจผล AI กับแหล่งข้อมูล",
        "กฎการเปิดเผยและความซื่อสัตย์ทางวิชาการ",
      ],
    },
  },
  {
    id: "course-9",
    code: "Course 9",
    hours: "3 hours",
    hoursTh: "3 ชั่วโมง",
    icon: "Footprints",
    title: {
      en: "Gait Analysis & Pressure Sensor Technology",
      th: "การวิเคราะห์การเดินและเทคโนโลยีเซนเซอร์ความดัน",
    },
    subtitle: {
      en: "Delivered by the Suratec Engineering Team",
      th: "จัดโดยทีมวิศวกรรม Suratec",
    },
    desc: {
      en: "The engineers who build Suratec's pressure-sensing products explain how a measurement of walking becomes clinical information. Covers pressure sensor types and how they are calibrated, the phases of the gait cycle, what a pressure map reveals about fall risk and diabetic foot risk, and how the data reaches a clinician.",
      th: "วิศวกรผู้สร้างผลิตภัณฑ์เซนเซอร์ความดันของ Suratec อธิบายว่าการวัดการเดินกลายเป็นข้อมูลคลินิกได้อย่างไร ครอบคลุมชนิดเซนเซอร์ความดันและการสอบเทียบ ระยะของวงจรการเดิน สิ่งที่แผนที่ความดันบอกเกี่ยวกับความเสี่ยงล้มและเท้าเบาหวาน และเส้นทางข้อมูลถึงแพทย์",
    },
    skills: {
      en: [
        "Pressure sensor types & calibration",
        "Gait cycle phases & pressure maps",
        "Clinical use in fall and diabetic foot risk",
      ],
      th: [
        "ชนิดเซนเซอร์ความดันและการสอบเทียบ",
        "ระยะวงจรการเดินและแผนที่ความดัน",
        "การใช้ทางคลินิกในความเสี่ยงล้มและเท้าเบาหวาน",
      ],
    },
  },
];

export const KTS_OVERVIEW_STATS = [
  {
    id: "labs",
    value: "13",
    labelEn: "Hands-on Laboratories",
    labelTh: "ห้องปฏิบัติการภาคปฏิบัติ",
    icon: "FlaskConical",
  },
  {
    id: "courses",
    value: "9",
    labelEn: "Academic Courses",
    labelTh: "รายวิชาวิชาการ",
    icon: "GraduationCap",
  },
  {
    id: "lab-size",
    value: "Up to 12",
    valueTh: "ไม่เกิน 12",
    labelEn: "Students — Hands-on Laboratories",
    labelTh: "นักเรียน — ห้องปฏิบัติการภาคปฏิบัติ",
    icon: "Users",
  },
  {
    id: "course-size",
    value: "Up to 40",
    valueTh: "ไม่เกิน 40",
    labelEn: "Students — Academic Courses",
    labelTh: "นักเรียน — รายวิชาวิชาการ",
    icon: "Users",
  },
  {
    id: "hours-1-9",
    value: "40 Hours",
    valueTh: "40 ชั่วโมง",
    labelEn: "Labs 1–9",
    labelTh: "Labs 1–9",
    icon: "Clock",
  },
  {
    id: "hours-10-13",
    value: "20 Hours",
    valueTh: "20 ชั่วโมง",
    labelEn: "Labs 10–13",
    labelTh: "Labs 10–13",
    icon: "Clock",
  },
  {
    id: "course-hours",
    value: "3–4 Hours",
    valueTh: "3–4 ชั่วโมง",
    labelEn: "Academic Courses",
    labelTh: "รายวิชาวิชาการ",
    icon: "Clock",
  },
];
