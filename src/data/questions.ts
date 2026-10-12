import { BoardSquare, Question, Challenge } from '../types';

export const BOARD_SQUARES: BoardSquare[] = [
  // 1-36
  { number: 1, type: 'start', color: '#10B981', label: 'MULAI', description: 'Kotak Awal Permainan' },
  { number: 2, type: 'question', color: '#3B82F6', label: 'Soal Word' },
  { number: 3, type: 'ladder', color: '#F59E0B', target: 15, label: 'Tangga ↗', description: 'Naik ke kotak 15' },
  { number: 4, type: 'normal', color: '#8B5CF6', label: 'Kotak Ceria' },
  { number: 5, type: 'challenge', color: '#EC4899', label: 'Tantangan 🎯' },
  { number: 6, type: 'question', color: '#06B6D4', label: 'Soal Word' },
  
  { number: 7, type: 'bonus', color: '#F97316', label: 'Bintang ⭐' },
  { number: 8, type: 'ladder', color: '#F59E0B', target: 21, label: 'Tangga ↗', description: 'Naik ke kotak 21' },
  { number: 9, type: 'question', color: '#10B981', label: 'Soal Word' },
  { number: 10, type: 'normal', color: '#6366F1', label: 'Kotak Santai' },
  { number: 11, type: 'challenge', color: '#EC4899', label: 'Tantangan 🎯' },
  { number: 12, type: 'question', color: '#3B82F6', label: 'Soal Word' },

  { number: 13, type: 'normal', color: '#F59E0B', label: 'Kotak Petualang' },
  { number: 14, type: 'question', color: '#06B6D4', label: 'Soal Word' },
  { number: 15, type: 'bonus', color: '#F97316', label: 'Ujung Tangga' },
  { number: 16, type: 'ladder', color: '#F59E0B', target: 27, label: 'Tangga ↗', description: 'Naik ke kotak 27' },
  { number: 17, type: 'snake', color: '#EF4444', target: 6, label: 'Ular ↘', description: 'Meluncur ke kotak 6' },
  { number: 18, type: 'question', color: '#8B5CF6', label: 'Soal Word' },

  { number: 19, type: 'challenge', color: '#EC4899', label: 'Tantangan 🎯' },
  { number: 20, type: 'question', color: '#10B981', label: 'Soal Word' },
  { number: 21, type: 'bonus', color: '#F97316', label: 'Ujung Tangga' },
  { number: 22, type: 'ladder', color: '#F59E0B', target: 33, label: 'Tangga ↗', description: 'Naik ke kotak 33' },
  { number: 23, type: 'snake', color: '#EF4444', target: 10, label: 'Ular ↘', description: 'Meluncur ke kotak 10' },
  { number: 24, type: 'question', color: '#3B82F6', label: 'Soal Word' },

  { number: 25, type: 'normal', color: '#6366F1', label: 'Kotak Pintar' },
  { number: 26, type: 'question', color: '#10B981', label: 'Soal Word' },
  { number: 27, type: 'bonus', color: '#F97316', label: 'Ujung Tangga' },
  { number: 28, type: 'challenge', color: '#EC4899', label: 'Tantangan 🎯' },
  { number: 29, type: 'snake', color: '#EF4444', target: 14, label: 'Ular ↘', description: 'Meluncur ke kotak 14' },
  { number: 30, type: 'question', color: '#06B6D4', label: 'Soal Word' },

  { number: 31, type: 'question', color: '#8B5CF6', label: 'Soal Word' },
  { number: 32, type: 'challenge', color: '#EC4899', label: 'Tantangan 🎯' },
  { number: 33, type: 'bonus', color: '#F97316', label: 'Ujung Tangga' },
  { number: 34, type: 'question', color: '#3B82F6', label: 'Soal Word' },
  { number: 35, type: 'snake', color: '#EF4444', target: 19, label: 'Ular ↘', description: 'Meluncur ke kotak 19' },
  { number: 36, type: 'finish', color: '#10B981', label: 'FINISH 🏆', description: 'Garis Akhir Petualangan' }
];

export const WORD_QUESTIONS: Question[] = [
  {
    id: 'q1',
    topic: 'Bold',
    question: 'Ikon B pada Microsoft Word digunakan untuk apa?',
    options: ['Memiringkan tulisan', 'Menebalkan tulisan', 'Menggarisbawahi tulisan', 'Mengubah warna tulisan'],
    correctIndex: 1,
    explanation: 'Ikon B (Bold) digunakan untuk membuat tulisan menjadi lebih tebal.',
    iconName: 'bold'
  },
  {
    id: 'q2',
    topic: 'Italic',
    question: 'Kalau ingin membuat tulisan miring, ikon apa yang digunakan?',
    options: ['Bold', 'Italic', 'Underline', 'Bullets'],
    correctIndex: 1,
    explanation: 'Ikon I (Italic) berfungsi untuk memiringkan tulisan atau kata asing.',
    iconName: 'italic'
  },
  {
    id: 'q3',
    topic: 'Bullets',
    question: 'Kalau ingin membuat daftar dengan tanda titik atau bulatan, fitur apa yang kita pilih?',
    options: ['Numbering', 'Page Border Art', 'Bullets', 'Font Size'],
    correctIndex: 2,
    explanation: 'Bullets digunakan untuk membuat daftar poin berupa tanda titik, kotak, atau simbol.',
    iconName: 'bullets'
  },
  {
    id: 'q4',
    topic: 'Numbering',
    question: 'Kalau ingin membuat daftar bernomor urut 1, 2, 3, fitur apa yang digunakan?',
    options: ['Numbering', 'Italic', 'Center', 'Insert Symbol'],
    correctIndex: 0,
    explanation: 'Numbering otomatis memberi nomor berurutan pada daftar tulisan kita.',
    iconName: 'numbering'
  },
  {
    id: 'q5',
    topic: 'Center',
    question: 'Kalau ingin tulisan judul berada tepat di tengah halaman, kita pilih fitur apa?',
    options: ['Align Left', 'Align Right', 'Center', 'Justify'],
    correctIndex: 2,
    explanation: 'Center (Rata Tengah) meletakkan posisi tulisan persis di bagian tengah baris.',
    iconName: 'center'
  },
  {
    id: 'q6',
    topic: 'Align Left',
    question: 'Kalau ingin tulisan rapi dan rata di sebelah kiri saja, fitur apa yang dipilih?',
    options: ['Align Left', 'Center', 'Align Right', 'Justify'],
    correctIndex: 0,
    explanation: 'Align Left (Rata Kiri) membuat baris tulisan tersusun rapi di tepi kiri.',
    iconName: 'align-left'
  },
  {
    id: 'q7',
    topic: 'Align Right',
    question: 'Kalau ingin tulisan rata di sebelah kanan (seperti tempat dan tanggal surat), fitur apa yang digunakan?',
    options: ['Bullets', 'Align Right', 'Underline', 'Font'],
    correctIndex: 1,
    explanation: 'Align Right (Rata Kanan) merapikan tulisan di sisi sebelah kanan halaman.',
    iconName: 'align-right'
  },
  {
    id: 'q8',
    topic: 'Justify',
    question: 'Kalau ingin tulisan paragraf rapi rata di sisi kiri sekaligus kanan, fitur apa yang digunakan?',
    options: ['Center', 'Align Left', 'Justify', 'Numbering'],
    correctIndex: 2,
    explanation: 'Justify meratakan teks secara seimbang di kedua sisi kiri dan kanan.',
    iconName: 'justify'
  },
  {
    id: 'q9',
    topic: 'Font',
    question: 'Kalau ingin mengganti model atau bentuk jenis huruf (seperti Arial atau Calibri), bagian apa yang kita ubah?',
    options: ['Font', 'Font Size', 'Bullets', 'Insert Picture'],
    correctIndex: 0,
    explanation: 'Font (jenis huruf) digunakan untuk memilih bentuk tulisan yang kita sukai.',
    iconName: 'font'
  },
  {
    id: 'q10',
    topic: 'Font Size',
    question: 'Kalau ingin memperbesar atau memperkecil ukuran tulisan, kotak angka mana yang diubah?',
    options: ['Font Color', 'Font Size', 'Underline', 'Numbering'],
    correctIndex: 1,
    explanation: 'Font Size mengatur seberapa besar atau kecil ukuran teks dokumen.',
    iconName: 'font-size'
  },
  {
    id: 'q11',
    topic: 'Page Border Art',
    question: 'Kalau ingin memberikan bingkai hiasan lucu atau bermotif di pinggir kertas, fitur apa yang dipakai?',
    options: ['Page Border Art', 'Italic', 'Bullets', 'Align Right'],
    correctIndex: 0,
    explanation: 'Page Border Art menambahkan garis tepi berhias gambar menarik di sekeliling halaman.',
    iconName: 'border'
  },
  {
    id: 'q12',
    topic: 'Insert Picture',
    question: 'Kalau ingin memasukkan foto atau gambar ke dalam dokumen Microsoft Word, menu apa yang kita klik?',
    options: ['Insert Picture', 'Numbering', 'Font', 'Underline'],
    correctIndex: 0,
    explanation: 'Insert Picture berfungsi menyisipkan file foto atau gambar dari komputer ke dokumen.',
    iconName: 'picture'
  },
  {
    id: 'q13',
    topic: 'Insert Symbol',
    question: 'Kalau ingin menambahkan tanda khusus seperti tanda centang (✓) atau derajat (°), kita pilih apa?',
    options: ['Center', 'Insert Symbol', 'Bold', 'Font Size'],
    correctIndex: 1,
    explanation: 'Insert Symbol memudahkan kita menyisipkan berbagai simbol unik yang tidak ada di keyboard.',
    iconName: 'symbol'
  },
  {
    id: 'q14',
    topic: 'Underline',
    question: 'Apa fungsi utama dari ikon U bergaris bawah (Underline)?',
    options: ['Membuat tulisan tebal', 'Membuat tulisan miring', 'Memberi garis bawah pada tulisan', 'Memindahkan tulisan ke tengah'],
    correctIndex: 2,
    explanation: 'Underline memberi garis tepat di bawah teks yang kita pilih.',
    iconName: 'underline'
  },
  {
    id: 'q15',
    topic: 'Bold',
    question: 'Ketika menulis judul artikel di Word agar tampak tegas dan menonjol, biasanya kita mengaktifkan fitur apa?',
    options: ['Italic', 'Bold', 'Insert Symbol', 'Align Right'],
    correctIndex: 1,
    explanation: 'Fitur Bold sangat pas untuk menonjolkan judul agar mudah dibaca.',
    iconName: 'bold'
  },
  {
    id: 'q16',
    topic: 'Italic',
    question: 'Ikon berhuruf "I" yang sedikit miring melambangkan perintah apa?',
    options: ['Insert', 'Information', 'Italic', 'Index'],
    correctIndex: 2,
    explanation: 'Huruf "I" miring melambangkan fungsi Italic untuk membuat teks miring.',
    iconName: 'italic'
  },
  {
    id: 'q17',
    topic: 'Bullets',
    question: 'Ikon yang menampilkan gambar tiga baris dengan titik-titik di depannya disebut apa?',
    options: ['Bullets', 'Numbering', 'Page Border', 'Font Size'],
    correctIndex: 0,
    explanation: 'Ikon baris dengan titik kecil di sampingnya adalah ikon Bullets.',
    iconName: 'bullets'
  },
  {
    id: 'q18',
    topic: 'Numbering',
    question: 'Saat kita ingin menulis urutan langkah memasak mie instan (langkah 1 sampai 4), fitur mana yang paling tepat?',
    options: ['Underline', 'Numbering', 'Justify', 'Page Border Art'],
    correctIndex: 1,
    explanation: 'Numbering sangat cocok untuk urutan langkah berjenjang seperti 1, 2, 3.',
    iconName: 'numbering'
  },
  {
    id: 'q19',
    topic: 'Align Left',
    question: 'Secara bawaan (default), ketika kita baru mengetik paragraf baru di Word, posisinya rata di mana?',
    options: ['Rata Kiri (Align Left)', 'Rata Kanan (Align Right)', 'Rata Tengah (Center)', 'Rata Kanan Kiri (Justify)'],
    correctIndex: 0,
    explanation: 'Secara bawaan tulisan di Word otomatis tersusun rata kiri (Align Left).',
    iconName: 'align-left'
  },
  {
    id: 'q20',
    topic: 'Center',
    question: 'Ikon empat baris garis yang semuanya simetris di bagian tengah adalah ikon untuk apa?',
    options: ['Align Right', 'Center', 'Align Left', 'Bold'],
    correctIndex: 1,
    explanation: 'Garis yang berada di poros tengah adalah lambang dari tombol Center.',
    iconName: 'center'
  },
  {
    id: 'q21',
    topic: 'Align Right',
    question: 'Kapan waktu yang paling sering menggunakan fitur Align Right (Rata Kanan)?',
    options: ['Saat membuat judul tengah', 'Saat menulis nomor urut', 'Saat menulis tanggal dan tanda tangan di pojok kanan', 'Saat memasukkan foto'],
    correctIndex: 2,
    explanation: 'Align Right sangat lazim untuk posisi tanggal surat di sebelah kanan.',
    iconName: 'align-right'
  },
  {
    id: 'q22',
    topic: 'Justify',
    question: 'Buku pelajaran dan koran biasanya memiliki teks yang rapi di pinggir kiri dan kanan. Ini menggunakan fitur apa?',
    options: ['Justify', 'Center', 'Align Left', 'Underline'],
    correctIndex: 0,
    explanation: 'Justify membuat tepi kiri dan kanan lurus sejajar seperti lembaran buku cetak.',
    iconName: 'justify'
  },
  {
    id: 'q23',
    topic: 'Font',
    question: 'Times New Roman, Arial, dan Comic Sans adalah contoh nama dari apa?',
    options: ['Ukuran kertas', 'Font (Jenis Huruf)', 'Nama bingkai foto', 'Warna teks'],
    correctIndex: 1,
    explanation: 'Semuanya adalah nama dari jenis huruf atau Font di Microsoft Word.',
    iconName: 'font'
  },
  {
    id: 'q24',
    topic: 'Font Size',
    question: 'Jika ukuran huruf diubah dari 12 menjadi 24, apa yang akan terjadi pada tulisan?',
    options: ['Tulisan menjadi miring', 'Tulisan bertambah besar', 'Tulisan bergeser ke kanan', 'Tulisan bertambah tebal'],
    correctIndex: 1,
    explanation: 'Angka Font Size yang semakin besar membuat ukuran huruf semakin besar.',
    iconName: 'font-size'
  },
  {
    id: 'q25',
    topic: 'Page Border Art',
    question: 'Fitur Page Border Art biasanya dapat kita temukan di dalam pengaturan apa?',
    options: ['Borders and Shading (Garis Tepi Halaman)', 'Menu Insert Sound', 'Font Color', 'Align Left'],
    correctIndex: 0,
    explanation: 'Page Border Art berada di pengaturan Border halaman untuk menghias keliling kertas.',
    iconName: 'border'
  },
  {
    id: 'q26',
    topic: 'Insert Picture',
    question: 'Setelah menekan Insert Picture, foto yang kita pilih dari laptop akan muncul di mana?',
    options: ['Di dalam lembar dokumen Word', 'Di tempat sampah', 'Di luar layar laptop', 'Di menu start'],
    correctIndex: 0,
    explanation: 'Foto langsung ditampilkan di posisi kursor lembar kerja dokumen Word.',
    iconName: 'picture'
  },
  {
    id: 'q27',
    topic: 'Insert Symbol',
    question: 'Tanda bintang khusus, panah melengkung, atau emotikon karakter di Word dapat disisipkan lewat apa?',
    options: ['Insert Symbol', 'Font Size', 'Align Right', 'Underline'],
    correctIndex: 0,
    explanation: 'Fitur Insert Symbol menyediakan ratusan karakter dan lambang istimewa.',
    iconName: 'symbol'
  },
  {
    id: 'q28',
    topic: 'Underline',
    question: 'Tulisan: "<u>Selamat Datang</u>" memiliki garis di bawahnya. Efek ini dibuat dengan apa?',
    options: ['Bold', 'Italic', 'Underline', 'Bullets'],
    correctIndex: 2,
    explanation: 'Underline memberikan garis penegas tepat di bawah kalimat.',
    iconName: 'underline'
  },
  {
    id: 'q29',
    topic: 'Bold',
    question: 'Perbedaan teks biasa dengan teks yang diberi Bold adalah...',
    options: ['Teks Bold berwarna merah', 'Teks Bold lebih tebal dan hitam pekat', 'Teks Bold menjadi miring', 'Teks Bold berukuran kecil'],
    correctIndex: 1,
    explanation: 'Teks Bold memiliki ketebalan goresan huruf yang lebih tebal dan tegas.',
    iconName: 'bold'
  },
  {
    id: 'q30',
    topic: 'Font Size',
    question: 'Jika kamu ingin memperkecil tulisan catatan agar muat banyak di satu kertas, kamu harus...',
    options: ['Menaikkan Font Size', 'Menurunkan angka Font Size', 'Mengklik Underline', 'Mengklik Justify'],
    correctIndex: 1,
    explanation: 'Menurunkan angka Font Size (misal dari 14 ke 11) akan memperkecil ukuran tulisan.',
    iconName: 'font-size'
  },
  {
    id: 'q31',
    topic: 'Italic',
    question: 'Dalam penulisan Bahasa Indonesia, istilah kata dari bahasa Inggris biasanya dicetak...',
    options: ['Tebal (Bold)', 'Miring (Italic)', 'Bergaris bawah (Underline)', 'Rata Kanan (Align Right)'],
    correctIndex: 1,
    explanation: 'Istilah asing umumnya ditulis dengan gaya cetak miring (Italic).',
    iconName: 'italic'
  },
  {
    id: 'q32',
    topic: 'Insert Picture',
    question: 'Ikon bergambar pemandangan gunung dan matahari kecil pada tab Insert berfungsi untuk...',
    options: ['Insert Picture (Menyisipkan Gambar)', 'Membuat Huruf Besar', 'Mengganti Margin', 'Menutup Dokumen'],
    correctIndex: 0,
    explanation: 'Ikon bergambar pemandangan melambangkan fungsi Insert Picture.',
    iconName: 'picture'
  }
];

export const WORD_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    topic: 'Bold',
    title: 'Tantangan Bold (Tebal)',
    instruction: 'Sebutkan apa fungsi utama ikon Bold di Microsoft Word, dan berikan 1 contoh kapan kita memakainya!',
    keyPoints: ['Menebalkan huruf', 'Cocok untuk judul, subjudul, atau kata kunci penting'],
    iconName: 'bold'
  },
  {
    id: 'c2',
    topic: 'Italic',
    title: 'Tantangan Italic (Miring)',
    instruction: 'Sebutkan apa fungsi ikon Italic dan mengapa kita perlu memiringkan tulisan!',
    keyPoints: ['Memiringkan huruf', 'Digunakan untuk kata bahasa asing, istilah ilmiah, atau kutipan'],
    iconName: 'italic'
  },
  {
    id: 'c3',
    topic: 'Bullets',
    title: 'Tantangan Bullets vs Numbering',
    instruction: 'Jelaskan dengan bahasa kalian sendiri: apa bedanya Bullets dengan Numbering?',
    keyPoints: ['Bullets memakai simbol/tanda titik bulat tanpa urutan', 'Numbering memakai angka urut 1, 2, 3 berurutan'],
    iconName: 'bullets'
  },
  {
    id: 'c4',
    topic: 'Center',
    title: 'Tantangan Rata Tengah (Center)',
    instruction: 'Sebutkan fungsi ikon Center dan bagian tulisan apa saja yang paling sering dibuat di tengah!',
    keyPoints: ['Menempatkan teks di tengah baris', 'Contoh: Judul makalah, puisi, sampul tugas'],
    iconName: 'center'
  },
  {
    id: 'c5',
    topic: 'Underline',
    title: 'Tantangan Underline (Garis Bawah)',
    instruction: 'Sebutkan fungsi ikon Underline dan bagaimana bentuk ikonnya pada menu Word!',
    keyPoints: ['Memberikan garis di bawah tulisan', 'Ikonnya adalah huruf U dengan garis di bawahnya'],
    iconName: 'underline'
  },
  {
    id: 'c6',
    topic: 'Font',
    title: 'Tantangan Jenis Font',
    instruction: 'Sebutkan fitur untuk mengganti model tulisan, dan sebutkan minimal 2 contoh nama font yang kalian ingat!',
    keyPoints: ['Fitur Font', 'Contoh: Arial, Calibri, Times New Roman, Comic Sans'],
    iconName: 'font'
  },
  {
    id: 'c7',
    topic: 'Font Size',
    title: 'Tantangan Ukuran Tulisan (Font Size)',
    instruction: 'Bagaimana cara memperbesar tulisan yang sudah diketik di Microsoft Word?',
    keyPoints: ['Blok teks lalu pilih angka lebih besar di kotak Font Size'],
    iconName: 'font-size'
  },
  {
    id: 'c8',
    topic: 'Insert Picture',
    title: 'Tantangan Sisipkan Gambar',
    instruction: 'Sebutkan nama fitur untuk memasukkan gambar atau foto ke Word dan di tab menu apa letaknya!',
    keyPoints: ['Fitur Insert Picture', 'Berada di menu / tab Insert'],
    iconName: 'picture'
  },
  {
    id: 'c9',
    topic: 'Insert Symbol',
    title: 'Tantangan Sisipkan Simbol',
    instruction: 'Sebutkan apa fungsi fitur Insert Symbol dan sebutkan contoh simbol yang tidak ada di keyboard!',
    keyPoints: ['Menyisipkan lambang karakter unik', 'Contoh: derajat (°), centang (✓), tanda panah, pi (π)'],
    iconName: 'symbol'
  },
  {
    id: 'c10',
    topic: 'Page Border Art',
    title: 'Tantangan Bingkai Halaman (Page Border Art)',
    instruction: 'Apa fungsi dari fitur Page Border Art dan bagaimana tampilannya pada kertas dokumen?',
    keyPoints: ['Memberikan hiasan bingkai bermotif di tepi kertas', 'Membuat lembar dokumen seperti sertifikat atau undangan berhias'],
    iconName: 'border'
  },
  {
    id: 'c11',
    topic: 'Align Right',
    title: 'Tantangan Rata Kanan (Align Right)',
    instruction: 'Sebutkan fungsi tombol Align Right dan di posisi mana biasanya tulisan ini dipakai!',
    keyPoints: ['Membuat tulisan rata di tepi kanan', 'Biasa dipakai untuk titimangsa tanggal surat atau nama pengirim di kanan'],
    iconName: 'align-right'
  },
  {
    id: 'c12',
    topic: 'Justify',
    title: 'Tantangan Rata Kiri-Kanan (Justify)',
    instruction: 'Apa keuntungan merapikan teks paragraf dengan fitur Justify dibandingkan Rata Kiri biasa?',
    keyPoints: ['Tepi kiri dan kanan sama-sama lurus rapi', 'Terlihat profesional dan rapi seperti buku atau koran cetak'],
    iconName: 'justify'
  }
];
