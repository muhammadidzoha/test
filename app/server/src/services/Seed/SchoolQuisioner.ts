export const booleanOptions = [
    {
        title: "Ya",
        score: 1
    },
    {
        title: "Tidak",
        score: 0
    },
];

export const schoolQuisionerQuestions = [
    {
        title: "Pelaksanaan Pendidikan Kesehatan",
        description: "Quisioner pelaksanaan pendidikan kesehatan di sekolah",
        stratification: "HEALTH_EDUCATION_MINIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Adanya rencana pembelajaran tentang pendidikan kesehatan", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Pendidikan kesehatan dilaksanakan secara kurikuler", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Pendidikan Jasmani dilaksanakan secara kurikuler", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ],
    },
    {
        title: "Pelaksanaan Pendidikan Kesehatan",
        description: "Quisioner pelaksanaan pendidikan kesehatan di sekolah untuk stratifikasi standar",
        stratification: "HEALTH_EDUCATION_STANDAR",
        for: "SCHOOL",
        questions: [
            { question: "Pendidikan jasmani dan kesehatan dilaksanakan secara ekstrakurikuler", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melaksanakan literasi dengan materi kesehatan", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melaksanakan pembinaan kader kesehatan", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melaksanakan kegiatan CTPS bersama", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melaksanakan sarapan bersama dengan gizi seimbang", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melaksanakan kegiatan sikat gigi bersama", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ]
    },
    {
        title: "Pelaksanaan Pendidikan Kesehatan",
        description: "Quisioner pelaksanaan pendidikan kesehatan di sekolah untuk stratifikasi Optimal",
        stratification: "HEALTH_EDUCATION_OPTIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah melakukan aktifitas fisik di antara jam pelajaran", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melakukan tes kebugaran", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Pendidikan kesehatan (kespro, napza, sanitasi, gizi) terintegrasi dengan mata pelajaran lain", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ]
    },
    {
        title: "Pelaksanaan Pendidikan Kesehatan",
        description: "Quisioner pelaksanaan pendidikan kesehatan di sekolah untuk stratifikasi paripurna",
        stratification: "HEALTH_EDUCATION_PARIPURNA",
        for: "SCHOOL",
        questions: [
            { question: "Penerapan pendidikan karakter dan keterampilan hidup sehat ", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Melibatkan orang tua dalam pendidikan kesehatan", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    // HEALTH SERVICE

    {
        title: "Pelaksanaan Pelayanan Kesehatan",
        description: "Quisioner Pelaksanaan pelayanan kesehatan untuk stratifikasi minimal",
        stratification: "HEALTH_SERVICE_MINIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah memfasilitasi puskesmas melaksanakan penjaringan kesehatan dan pemeriksaan berkala", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah membantu pelaksanaan imunisasi anak sekolah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memeriksa kebersihan diri peserta didik", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ]
    },
    {
        title: "Pelaksanaan Pelayanan Kesehatan",
        description: "Quisioner Pelaksanaan pelayanan kesehatan untuk stratifikasi standar",
        stratification: "HEALTH_SERVICE_STANDAR",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah melaksanakan pelayanan P3K (pertolongan pertama pada kecelakaan) dan P3P (pertolongan pertama pada penyakit)", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melibatkan Puskesmas dalam penanganan rujukan jika diperlukan", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memberikan obat cacing", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ]
    },
    {
        title: "Pelaksanaan Pelayanan Kesehatan",
        description: "Quisioner Pelaksanaan pelayanan kesehatan untuk stratifikasi optimal",
        stratification: "HEALTH_SERVICE_OPTIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah melaksanakan layanan konseling", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },
    {
        title: "Pelaksanaan Pelayanan Kesehatan",
        description: "Quisioner Pelaksanaan pelayanan kesehatan untuk stratifikasi paripurna",
        stratification: "HEALTH_SERVICE_PARIPURNA",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah menindaklanjuti hasil penjaringan dan pemeriksaan berkala ", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Menurunnya jumlah hari tidak masuk sekolah karena sakit ", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Peserta didik memiliki status gizi baik", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ]
    },

    // School Environment
    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat Untuk Stratifikasi Minimal",
        stratification: "SCHOOL_ENVIRONMENT_MINIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah dengan sumber air layak, tersedia di lingkungan sekolah dan cukup", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah dengan tempat cuci tangan dengan sabun dan air mengalir", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki toilet dengan kondisi baik dan terpisah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki saluran drainase", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki kantin", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki lahan/ruang terbuka hijau", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki tempat sampah yang tertutup", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki tempat pembuangan sampah sementara yang tertutup", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Ruang kelas dalam keadaan bersih", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki aturan KTR, KTN, KTK, KTP", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat Untuk Stratifikasi Standar",
        stratification: "SCHOOL_ENVIRONMENT_STANDAR",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah memiliki rasio toilet sesuai dengan standar Permendikbud 24/2007 ", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki tempat sampah yang terpilah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki kantin sehat", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melaksanakan pemberantasan sarang nyamuk", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah menerapkan KTR", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat Untuk Stratifikasi OPTIMAL",
        stratification: "SCHOOL_ENVIRONMENT_OPTIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah memanfaatkan pekarangan sekolah dengan menanam tanaman obat dan pangan  ", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melakukan 3R", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Tersedia toilet MKM (Manajemen Kebersihan Menstruasi)", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat Untuk Stratifikasi PARIPURNA",
        stratification: "SCHOOL_ENVIRONMENT_PARIPURNA",
        for: "SCHOOL",
        questions: [
            { question: "Air minum disediakan oleh sekolah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memiliki rasio toilet sesuai dengan standar Kepmenkes 1429/2006", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Kantin telah mendapatkan stiker tanda laik higiene sanitasi", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Tersedia toilet untuk siswa disabilitas", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah bekerjasama dengan pihak lain untuk menyediakan bank sampah Sekolah melakukan kegiatan pengolahan tanaman obat dan pangan", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    // UKS MANAGEMENT
    {
        title: "Manajemen UKS",
        description: "Quisioner Tentang Manajemen UKS Untuk Stratifikasi Minimal",
        stratification: "UKS_MANAGEMENT_MINIMAL",
        for: "SCHOOL",
        questions: [
            { question: "UKS memiliki Buku pegangan kesehatan (Buku UKS, gizi seimbang, kespro, sanitasi, Napza dll) ", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Ada penanggung jawab UKS", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Ada KIE kesehatan (alat peraga, poster dll)", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Ada sarana prasarana olahraga", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Tersedia dana untuk kegiatan UKS dan pemeliharaan sanitasi sekolah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Terdapat kemitraan dengan puskesmas", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Terdapat perencanaan kegiatan UKS di sekolah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat Untuk Stratifikasi Standar",
        stratification: "UKS_MANAGEMENT_STANDAR",
        for: "SCHOOL",
        questions: [
            { question: "Tersedia dana untuk kegiatan UKS dan pemeliharaan sanitasi sekolah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melakukan konsultasi / koordinasi dengan Tim Pembina UKSSekolah memiliki ruang UKS", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat Untuk Stratifikasi Optimal",
        stratification: "UKS_MANAGEMENT_OPTIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Adanya kemitraan dengan instansi terkait", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Tersedia sarana dan prasarana sekolah aman bencana", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },

    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat Untuk Stratifikasi Paripurna",
        stratification: "UKS_MANAGEMENT_PARIPURNA",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah melakukan pembinaan dan pengawasan", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Seluruh guru terorientasi UKS", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah menggunakan rapor kesehatan lingkungan dan kantin", type: "BOOLEAN", isRequired: true, options: booleanOptions },
        ]
    },


];
