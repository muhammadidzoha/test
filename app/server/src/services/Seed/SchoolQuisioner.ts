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
        description: "Quisioner pelaksanaan pendidikan kesehatan di sekolah untuk stratifikasi optimal",
        stratification: "HEALTH_EDUCATION_OPTIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah melakukan aktifitas fisik di antara jam pelajaran", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah melakukan tes kebugaran", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Pendidikan kesehatan (kespro, napza, sanitasi, gizi) terintegrasi dengan mata pelajaran lain", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ]
    },
    {
        title: "Pelaksanaan Pelayanan Kesehatan",
        description: "Quisioner Pelaksanaan pelayanan kesehatan",
        stratification: "HEALTH_SERVICE_MINIMAL",
        for: "SCHOOL",
        questions: [
            { question: "Sekolah memfasilitasi puskesmas melaksanakan penjaringan kesehatan dan pemeriksaan berkala", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah membantu pelaksanaan imunisasi anak sekolah", type: "BOOLEAN", isRequired: true, options: booleanOptions },
            { question: "Sekolah memeriksa kebersihan diri peserta didik", type: "BOOLEAN", isRequired: true, options: booleanOptions }
        ]
    },
    {
        title: "Pembinaan Lingkungan Sehat",
        description: "Quisioner Tentang Pembinaan Lingkungan Sehat",
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
    }
];
