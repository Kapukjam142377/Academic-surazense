export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: {
      en: "X-ZENSE 101",
      th: "X-ZENSE 101",
    },
    category: "Biosensors",
    price: 150.0,
    description: {
      en: "Our Real-Time Analysis QCM Device is a compact and versatile solution designed for precise and efficient monitoring. At its core is a piezoelectric QCM chip securely mounted in a detachable holder, enabling easy handling and the convenient application of liquid media during measurements. The chip connects to a circuit board via a pogo-pin connector, ensuring reliable signal transfer. Paired with intuitive software, the device provides real-time signal measurement and data visualization, making it ideal for applications in biosensing, environmental monitoring, and material analysis. Designed for portability and ease of use.",
      th: "อุปกรณ์วิเคราะห์แบบเรียลไทม์ QCM ของเราคือโซลูชันขนาดกะทัดรัดและใช้งานได้หลากหลาย ออกแบบมาเพื่อการตรวจสอบที่แม่นยำและมีประสิทธิภาพ หัวใจหลักคือชิป QCM เพียโซอิเล็กทริกที่ยึดติดในแท่นยึดที่ถอดออกได้ ช่วยให้จัดการและหยดของเหลวระหว่างวัดได้ง่าย ชิปเชื่อมต่อกับแผงวงจรด้วยพินขั้วต่อแบบสปริง (pogo-pin) ให้การรับส่งสัญญาณที่มีความเสถียร เมื่อใช้คู่กับซอฟต์แวร์ที่เข้าใจง่าย อุปกรณ์นี้สามารถแสดงกราฟและวัดสัญญาณแบบเรียลไทม์ เหมาะสำหรับการประยุกต์ใช้ในระบบไบโอเซนเซอร์ การตรวจสอบสิ่งแวดล้อม และการวิเคราะห์วัสดุ ออกแบบมาเพื่อการพกพาและใช้งานง่าย",
    },
    image: "/product-drawing-2.jpg",
    status: "In Stock",
    specs: {
      model: "Xzense-101",
      dimensions: "120 x 80 x 40 mm",
      weight: "0.3 kg",
      minOrder: { en: "1 device", th: "1 เครื่อง" },
      principle: { en: "Piezoelectric Effect", th: "ปรากฏการณ์เพียโซอิเล็กทริก" },
      sensorType: { en: "Piezoelectric Quartz Crystal Microbalance (QCM)", th: "เครื่องตรวจวัดมวลแบบควอตซ์คริสตัล (QCM)" },
      frequencyRange: "1 MHz - 100 MHz",
      signalMeasurement: { en: "Real-time frequency & amplitude monitoring", th: "การตรวจวัดแอมพลิจูดและความถี่แบบเรียลไทม์" },
      holderDesign: { en: "Detachable liquid flow-cell ready holder", th: "แท่นยึดแบบถอดได้เพื่อความสะดวกในการหยดสารละลาย" },
      connectionInterface: { en: "Pogo-pin interface", th: "ขั้วต่อแบบสปริง (Pogo-pin)" },
      powerSupply: { en: "USB-powered (5V)", th: "จ่ายไฟผ่านพอร์ต USB (5V)" }
    }
  },
  {
    id: 2,
    name: {
      en: "5MHz QCM Sensor Chip",
      th: "ชิปเซนเซอร์ QCM 5MHz",
    },
    category: "Biosensors",
    price: 135.0,
    description: {
      en: "Standard 5MHz quartz crystal for broader mass detection range applications.",
      th: "แผ่นผลึกควอตซ์มาตรฐาน 5MHz สำหรับงานวิเคราะห์ที่ต้องการขอบเขตการตรวจวัดมวลที่กว้างขึ้น",
    },
    image: "/qcmgroupe.jpg",
    status: "Low Stock",
    specs: {
      model: "QCM-CHIP-5M",
      dimensions: "14 mm diameter",
      weight: "0.01 kg",
      minOrder: { en: "1 pack (5 pcs)", th: "1 แพ็ก (5 ชิ้น)" },
      principle: { en: "Acoustic Mass Loading", th: "การวัดการโหลดมวลคลื่นเสียง" },
      sensorType: { en: "AT-cut Quartz Crystal", th: "ควอตซ์คริสตัลชนิดตัดแบบ AT" },
      frequencyRange: "5.000 MHz nominal",
      signalMeasurement: { en: "Resonant Frequency Sweep", th: "การกวาดความถี่เรโซแนนซ์" },
      holderDesign: { en: "Dual electrode configuration", th: "โครงสร้างขั้วไฟฟ้าคู่หน้า-หลัง" },
      connectionInterface: { en: "Gold-plated spring contact pads", th: "แผ่นสัมผัสเคลือบทอง" },
      powerSupply: { en: "Excitation via QCM analyzer", th: "กระตุ้นสัญญาณผ่านเครื่องวิเคราะห์ QCM" }
    }
  },
  {
    id: 3,
    name: {
      en: "Standard Flow Cell",
      th: "โฟลว์เซลล์มาตรฐาน",
    },
    category: "Modules",
    price: 450.0,
    description: {
      en: "Acrylic flow cell optimized for uniform liquid flow over the sensor surface.",
      th: "โฟลว์เซลล์อะคริลิกที่ปรับแต่งให้เหมาะสมเพื่อให้ของเหลวไหลผ่านหน้าสัมผัสเซนเซอร์ได้อย่างสม่ำเสมอ",
    },
    image: null,
    status: "In Stock",
    specs: {
      model: "FC-STD-03",
      dimensions: "45 x 45 x 25 mm",
      weight: "0.15 kg",
      minOrder: { en: "1 unit", th: "1 ชิ้น" },
      principle: { en: "Laminar Flow Channeling", th: "การนำทิศการไหลแบบลามินาร์" },
      sensorType: { en: "Flow Cell Module", th: "โมดูลช่องไหลผ่าน" },
      frequencyRange: "N/A",
      signalMeasurement: { en: "Microfluidic flow control", th: "การควบคุมการไหลระดับไมโครฟลูอิดิก" },
      holderDesign: { en: "Quick-clamp acrylic seal", th: "ฝาครอบอะคริลิกแบบหนีบเร็ว" },
      connectionInterface: { en: "1/4-28 Flat-bottom fittings", th: "ข้อต่อท่อแบบเกลียว 1/4-28" },
      powerSupply: { en: "Passive", th: "ไม่ต้องใช้แหล่งจ่ายไฟ" }
    }
  },
  {
    id: 4,
    name: {
      en: "Advanced Data Acquisition Hub",
      th: "ฮับรับข้อมูลขั้นสูง",
    },
    category: "Modules",
    price: 1200.0,
    description: {
      en: "Real-time frequency and dissipation monitoring unit with USB interface.",
      th: "ชุดอุปกรณ์ตรวจวัดความถี่และการสลายพลังงานแบบเรียลไทม์ พร้อมอินเทอร์เฟซเชื่อมต่อ USB",
    },
    image: null,
    status: "In Stock",
    specs: {
      model: "DAQ-ADV-X1",
      dimensions: "180 x 120 x 50 mm",
      weight: "0.85 kg",
      minOrder: { en: "1 unit", th: "1 เครื่อง" },
      principle: { en: "Impedance/Resonance tracking", th: "การติดตามอิมพีแดนซ์และความถี่สั่นพ้อง" },
      sensorType: { en: "Frequency Analysis Hub", th: "ฮับประมวลผลความถี่ความละเอียดสูง" },
      frequencyRange: "1 MHz - 150 MHz tracking",
      signalMeasurement: { en: "Resonance, Dissipation & Phase", th: "ค่าความถี่สั่นพ้อง, การสลายพลังงาน และเฟส" },
      holderDesign: { en: "Shielded desktop housing", th: "กล่องโลหะป้องกันสัญญาณรบกวนภายนอก" },
      connectionInterface: { en: "BNC to Sensor, USB to Host PC", th: "สายต่อแบบ BNC ไปยังเซนเซอร์, USB ไปยังคอมพิวเตอร์" },
      powerSupply: { en: "External 12V DC (Included)", th: "อะแดปเตอร์แปลงไฟ 12V DC (มีให้ในชุด)" }
    }
  },
  {
    id: 5,
    name: {
      en: "Teflon Tubing Set",
      th: "ชุดท่อเทฟลอน",
    },
    category: "Accessories",
    price: 45.0,
    description: {
      en: "Chemical-resistant teflon tubing with standardized connectors (2 meters).",
      th: "ท่อเทฟลอนทนสารเคมี พร้อมข้อต่อเชื่อมมาตรฐาน (ความยาว 2 เมตร)",
    },
    image: null,
    status: "In Stock",
  },
  {
    id: 6,
    name: {
      en: "O-Ring Replacement Pack",
      th: "ชุดโอริงสำรอง",
    },
    category: "Accessories",
    price: 25.0,
    description: {
      en: "Pack of 10 viton O-rings for sealing the flow cell module.",
      th: "ชุดแหวนยางไวตัน (Viton O-rings) จำนวน 10 ชิ้น สำหรับซีลผนึกโมดูลโฟลว์เซลล์",
    },
    image: null,
    status: "In Stock",
  },
  {
    id: 7,
    name: {
      en: "Gold Surface Functionalization SAM Kit",
      th: "ชุดสารเคมีเตรียมพื้นผิวเซนเซอร์ทอง (SAM Kit)",
    },
    category: "Chemicals",
    price: 125.0,
    description: {
      en: "All-in-one chemical kit for establishing a carboxyl-terminated Self-Assembled Monolayer (SAM) on gold QCM sensors. Perfect for covalent immobilization of target DNA or antibody markers.",
      th: "ชุดสารเคมีครบวงจรสำหรับสร้างชั้นฟิล์มเดี่ยวจัดระเบียบตัวเอง (SAM) บนแผ่นชิปเซนเซอร์ทอง QCM เหมาะอย่างยิ่งสำหรับการตรึงโควาเลนต์ของตัวรับ DNA หรือแอนติบอดีที่ต้องการตรวจจับ",
    },
    image: "/reagents-kit.png",
    status: "In Stock",
    chemicalSpecs: {
      formula: "MUA + NHS + EDC Reactant Set",
      purity: "≥98% (Analytical Reagent Grade)",
      mw: "Mixed component kit",
      appearance: { en: "Crystalline solids & anhydrous buffers", th: "ของแข็งคริสตัลไลต์และบัฟเฟอร์แบบปราศจากน้ำ" },
      storage: { en: "4°C, keep desiccated & dark", th: "เก็บที่อุณหภูมิ 4 องศาเซลเซียส ในที่แห้งและพ้นแสง" },
      volumeWeight: { en: "Contains reagents for 25 runs", th: "ประกอบด้วยสารเคมีสำหรับการทดลอง 25 ครั้ง" }
    }
  },
  {
    id: 8,
    name: {
      en: "EGFR Antibody Conjugate Control Set",
      th: "สารควบคุมแอนติบอดี EGFR เข้มข้น",
    },
    category: "Chemicals",
    price: 280.0,
    description: {
      en: "Highly purified monoclonal antibody conjugate designed specifically for targeting epidermal growth factor receptors (EGFR). Provides a robust binding control for biosensor validation.",
      th: "แอนติบอดีคอนจูเกตโมโนโคลนอลบริสุทธิ์สูง ออกแบบมาเฉพาะเพื่อเข้าจับกับตัวรับการเจริญเติบโตของผิวหนัง (EGFR) ใช้เป็นสารควบคุมปฏิกิริยาเพื่อสอบเทียบเซนเซอร์",
    },
    image: "/antibody-vial.jpg",
    status: "In Stock",
    chemicalSpecs: {
      formula: "Monoclonal Anti-EGFR IgG (Rabbit)",
      purity: "≥95% by SDS-PAGE",
      mw: "~150 kDa",
      appearance: { en: "Clear colorless liquid solution", th: "สารละลายใสไม่มีสี" },
      storage: { en: "-20°C, avoid repeated freeze-thaw cycles", th: "เก็บที่อุณหภูมิ -20 องศาเซลเซียส หลีกเลี่ยงการแช่แข็งและละลายซ้ำ" },
      volumeWeight: "1.5 mL (1.0 mg/mL concentration)"
    }
  },
  {
    id: 9,
    name: {
      en: "MUA (11-Mercaptoundecanoic Acid) Linker",
      th: "สารยึดเกาะทอง MUA (11-Mercaptoundecanoic Acid)",
    },
    category: "Chemicals",
    price: 48.0,
    description: {
      en: "Thiol-alkane carboxyl molecule used to form high density self-assembled monolayers (SAMs) on clean gold substrates, enabling coupling reactions through EDC/NHS pathways.",
      th: "โมเลกุลไธออล-อัลเคนคาร์บอกซิล ใช้ในการเตรียมชั้นโมโนเลเยอร์ที่มีความหนาแน่นสูงบนแผ่นทองคำเหนี่ยวนำ เพื่อการเกาะจับพันธะโควาเลนต์ผ่านปฏิกิริยา EDC/NHS",
    },
    image: "/mua-powder.jpg",
    status: "In Stock",
    chemicalSpecs: {
      formula: "HS(CH2)10CO2H",
      purity: "≥98.0% (HPLC)",
      mw: "218.36 g/mol",
      appearance: { en: "White to off-white crystalline powder", th: "ผงคริสตัลสีขาวหรือขาวนวล" },
      storage: { en: "2-8°C, seal tightly under inert nitrogen", th: "เก็บที่อุณหภูมิ 2-8 องศาเซลเซียส ปิดผนึกภายใต้แก๊สไนโตรเจน" },
      volumeWeight: "500 mg"
    }
  },
  {
    id: 10,
    name: {
      en: "Phosphate-Buffered Saline (PBS) Pouches",
      th: "ผงเกลือบัฟเฟอร์ PBS (pH 7.4)",
    },
    category: "Chemicals",
    price: 18.50,
    description: {
      en: "DNase, RNase, and Protease-free standard buffer pouches. Maintains pH 7.4 at room temperature, providing stable ionic conditions for microfluidic biosensor measurement channels.",
      th: "ผงเตรียมบัฟเฟอร์มาตรฐานปราศจากสารทำลายดีเอ็นเอและอาร์เอ็นเอ รักษาค่าความเป็นกรดด่างที่ pH 7.4 ให้สภาวะไอออนที่เสถียรสำหรับการวัดสัญญาณในไมโครฟลูอิดิกเซนเซอร์",
    },
    image: null,
    status: "In Stock",
    chemicalSpecs: {
      formula: "Phosphate/Saline Buffer Salt Mix",
      purity: "Molecular Biology Grade",
      mw: "N/A",
      appearance: { en: "White granular powder mix", th: "ผงเกลือละเอียดสีขาว" },
      storage: { en: "Room Temperature (15-30°C), keep dry", th: "เก็บที่อุณหภูมิห้อง (15-30 องศาเซลเซียส) ในที่แห้ง" },
      volumeWeight: { en: "Pack of 10 pouches (yields 10L total buffer)", th: "แพ็ก 10 ซอง (ผสมได้สารละลายรวม 10 ลิตร)" }
    }
  },
  {
    id: 11,
    name: {
      en: "cfDNA Cancer Biomarker Isolation Kit",
      th: "ชุดสกัดคัดแยกสารพันธุกรรม cfDNA มะเร็ง",
    },
    category: "Chemicals",
    price: 350.0,
    description: {
      en: "Magnetic bead-based extraction kit optimized for isolating low concentration cell-free DNA (cfDNA) from plasma or serum samples. Specially matched with SuraZense immunoassay diagnostic protocols.",
      th: "ชุดสกัดระดับโมเลกุลโดยใช้บีดแม่เหล็ก ปรับแต่งเป็นพิเศษเพื่อเก็บกู้สารพันธุกรรมอิสระในกระแสเลือด (cfDNA) ที่มีความเข้มข้นต่ำ เหมาะสำหรับการทดสอบคัดกรองมะเร็งร่วมกับซอฟต์แวร์ Xzense",
    },
    image: "/extraction-kit.jpg",
    status: "Low Stock",
    chemicalSpecs: {
      formula: "Magnetic Beads + Lysis Buffer + Wash Buffer Set",
      purity: "High Yield Diagnostic Grade",
      mw: "N/A",
      appearance: { en: "Liquid buffers and magnetic bead suspensions", th: "สารละลายบัฟเฟอร์และสารแขวนลอยบีดแม่เหล็ก" },
      storage: { en: "4°C (buffers) / -20°C (enzymes, keep frozen)", th: "เก็บที่อุณหภูมิ 4 องศาเซลเซียส (น้ำยา) / -20 องศาเซลเซียส (เอนไซม์)" },
      volumeWeight: { en: "50 diagnostic prep runs", th: "สำหรับสกัดและตรวจวัดจำนวน 50 ตัวอย่าง" }
    }
  },
  {
    id: 12,
    name: {
      en: "Hands-on QCM Calibration Workshop",
      th: "หลักสูตรเวิร์กช็อปสอบเทียบ QCM ภาคปฏิบัติ",
    },
    category: "Courses",
    price: 199.0,
    description: {
      en: "Interactive laboratory session on ESP32-based frequency sweeps, noise reduction filters, and piezoelectric sensor characterization. Guided directly by SuraZense engineering instructors. Certificate included.",
      th: "หลักสูตรฝึกปฏิบัติในห้องแล็บเกี่ยวกับการกวาดความถี่ด้วย ESP32, ตัวกรองลดสัญญาณรบกวน และคุณลักษณะเซนเซอร์เพียโซอิเล็กทริก สอนโดยวิศวกร SuraZense โดยตรง พร้อมใบรับรองสำเร็จหลักสูตร",
    },
    image: "/biotech-course.png",
    status: "In Stock",
    courseSpecs: {
      duration: { en: "3 hours (Half day)", th: "3 ชั่วโมง (ครึ่งวัน)" },
      level: { en: "Beginner / Intermediate", th: "ระดับเริ่มต้น / ปานกลาง" },
      location: { en: "SuraZense Tech Lab, SUT Campus", th: "ห้องปฏิบัติการ SuraZense ในพื้นที่ มทส." },
      deliveryMode: { en: "In-Person Hands-on Training", th: "ฝึกอบรมออนไซต์พร้อมบอร์ดและชิปทดลองจริง" },
      curriculum: {
        en: ["Introduction to QCM resonance", "ESP32 serial connection and calibration", "Signal noise isolation and diagnostics"],
        th: ["พื้นฐานฟิสิกส์การสั่นพ้องของ QCM", "การรับส่งข้อมูลผ่านพอร์ต Serial และสอบเทียบ ESP32", "การวิเคราะห์และกรองสัญญาณรบกวนฮาร์ดแวร์"]
      }
    }
  },
  {
    id: 13,
    name: {
      en: "Biomarker Binding Kinetics Lab Course",
      th: "หลักสูตรแล็บจลนศาสตร์การเกาะจับสารบ่งชี้มะเร็ง",
    },
    category: "Courses",
    price: 299.0,
    description: {
      en: "Hands-on practice covers building carboxyl self-assembled monolayers, activating them with EDC/NHS, conjugating tumor antibodies, and monitoring binding kinetics curves in real time. Great for life scientists.",
      th: "ฝึกฝนการเตรียมชั้นฟิล์มเดี่ยว MUA ตรึงด้วย EDC/NHS, การสร้างพันธะแอนติบอดีจำเพาะต่อมะเร็ง และเฝ้าสังเกตกราฟแสดงจลนศาสตร์การเกาะจับแบบเรียลไทม์ เหมาะอย่างยิ่งสำหรับนักวิจัยชีววิทยา",
    },
    image: "/biotech-course.png",
    status: "In Stock",
    courseSpecs: {
      duration: { en: "4 hours (Half day)", th: "4 ชั่วโมง (ครึ่งวัน)" },
      level: { en: "Intermediate / Advanced", th: "ระดับปานกลาง / ขั้นสูง" },
      location: { en: "Biotech Laboratory, SUT Campus", th: "ห้องปฏิบัติการเทคโนโลยีชีวภาพ อาคารวิจัย มทส." },
      deliveryMode: { en: "In-Person Laboratory Practice", th: "ปฏิบัติการออนไซต์ด้วยน้ำยาจริงและการใช้เครื่องวัด" },
      curriculum: {
        en: ["Gold surface chemistry and SAM preparation", "EDC/NHS ligand activation protocols", "Real-time antibody-antigen kinetic recording"],
        th: ["การล้างแผ่นทองคำและการเตรียมนํ้ายา SAM", "การกระตุ้นปฏิกิริยา EDC/NHS เพื่อเตรียมตรึงแอนติเจน", "การวิเคราะห์อัตราการจับตัวของแอนติบอดีแบบเรียลไทม์"]
      }
    }
  },
  {
    id: 14,
    name: {
      en: "Quantitative Biosignal Analysis Masterclass",
      th: "หลักสูตรออนไลน์คณิตศาสตร์การประมวลสัญญาณชีวภาพ",
    },
    category: "Courses",
    price: 149.0,
    description: {
      en: "Advanced online theory course focusing on digital signal processing filters. Covers Savitzky-Golay regression smoothing, polynomial baseline drift correction, and Univariate Splines for peak frequency upsampling.",
      th: "วิชาทฤษฎีและปฏิบัติการออนไลน์ขั้นสูง มุ่งเน้นไปที่การประมวลผลสัญญาณตัวบ่งชี้การแพทย์ การใช้ตัวกรอง Savitzky-Golay, การดริฟต์เส้นฐาน และ Univariate Splines เพื่อการค้นหาตำแหน่งความถี่สูงสุดอย่างแม่นยำ",
    },
    image: "/biotech-course.png",
    status: "In Stock",
    courseSpecs: {
      duration: { en: "5 weeks (10 hours total)", th: "5 สัปดาห์ (รวม 10 ชั่วโมงเรียน)" },
      level: { en: "Advanced (Requires Basic Python/JS)", th: "ระดับขั้นสูง (จำเป็นต้องมีความรู้การเขียนโปรแกรมเบื้องต้น)" },
      location: { en: "SuraZense Online Learning Portal", th: "แพลตฟอร์มการเรียนรู้ออนไลน์ SuraZense" },
      deliveryMode: { en: "On-demand Video Lectures + Coding Exercises", th: "วิดีโอบรรยายออนไลน์และแบบฝึกหัดโค้ดดิ้งประมวลสัญญาณ" },
      curriculum: {
        en: ["Digital filters (Savitzky-Golay & moving average)", "Baseline correction mathematical models", "Spline peak interpolation algorithms"],
        th: ["ตัวกรองดิจิทัล (Savitzky-Golay และค่าเฉลี่ยเคลื่อนที่)", "แบบจำลองคณิตศาสตร์ในการปรับค่าความเพี้ยนของ baseline", "อัลกอริทึม interpolation ของ spline สำหรับความถี่สั่นพ้อง"]
      }
    }
  }
];
