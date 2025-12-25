// Mock data for development - matches structure expected from Google Places API + Supabase
export const mockAgencies = [
    {
        id: "apex-digital-strategies",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
        name: "Apex Digital Strategies",
        logo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDenhD0tzgwGw3eUt3BKdXy7dNbPBeRtWMOpIJIMiqGDS7yOgWI89uZj49MuQGvNwM855q4O6XSLjdgUFNwsB4WwJX05Q3iRzkgVytWsuFKB6oNTcTdkTFwgy_jgECdLsNXtte3NQPX-C8i_8Mc7vA76eHOKVjsno677Nq2zyvdS_UCEVEF-qaFB4ZRa2iAcAgPcOP6MC54ApF6kRk2MpB3LvQ0QypySuBfJ8FTS7TjGhRft8wcB4GnkvPIuvh8Cq-NDJtbLfyCcrM",
        cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEleH5jXQVFdc3WMC7IumEM52VUqvPuCMgkC3dvXaeYWDoQ-QL1K6YGuqQIlyM3i_nRL3ec4EgaqZTrgOppg0ERql31X1y_MWbC-iNdCHZaTeYAVrnxfw3CyQ9asorO5xQzcL-SvkncXW9N6L7BmLeZ1teSdrifQaDHxLXQUabk36l4xD2bOnqvPsoHGE3_1KN9kJVeZUBGXa6ojO9bU6K7_wppWN_nPX4b-W1Y3xAUAXlWXRk_r4DBVF-jNZEaMMWDvdVAQDGC2Y",
        rating: 4.9,
        review_count: 120,
        location: {
            city: "New York",
            country: "USA",
            address: "350 5th Ave, New York, NY 10118",
            lat: 40.7484,
            lng: -73.9857,
            distance_km: 2.3
        },
        description: "Apex Digital Strategies is a top-tier digital marketing agency specializing in growth for SaaS and Tech companies. We leverage data-driven insights to maximize ROI and have helped over 50 startups reach unicorn status.",
        services: [
            { name: "SEO Optimization", description: "Audit, Strategy & Link Building", price_from: 1000 },
            { name: "Content Marketing", description: "Blogs, Whitepapers & Social", price_from: 2000 },
            { name: "Paid Search", description: "Google Ads & Retargeting", price_from: 1500 }
        ],
        tags: ["SEO", "PPC", "Content", "SaaS"],
        verified: true,
        is_registered: true,
        is_pro: true,
        website: "https://apexdigital.example.com",
        phone: "+1 (555) 123-4567",
        pricing: {
            starting_monthly: 1200,
            hourly_rate: 150
        },
        stats: {
            avg_roas: "300%",
            years_experience: 10,
            clients_served: 250
        },
        budget_level: "$$$",
        focus: "Tech/SaaS"
    },
    {
        id: "global-reach-pr",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frY5",
        name: "Global Reach",
        logo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLTyB-uwFC5zQsrGFXGoLX7xiKRCeaGmXR-XKifPbeq5VSklVZyqPRtKCttmjSHZcfveORIlJXAWfcnYFKFZSUNJWqRzVnGfpCVsj1UfN380ZXvDOF6bICmURZ_hiuEcc5MZ5VpYFeQU9ltBvlkxvmUdUTrwrMss_sGCrqDSS1BhjTUZwbIigEPZNEHjWJdrVWmBh2HlLLPltUKYqKiyKQvOyHIDRG3kVbJaq7vRW2UrTAVpU5gtt9EA9z2VpOJWloBLt7zEYHS_Y",
        cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5A8_VOUkhZytm-JkTsovkFu7hKe70Nler68lLL7883HstY8Z6dyDLpbjL6ouEluYCu1RYH6PcL-axGW5F4H41JCxLvaXfZ5Xyms08ZKn-mqqX8cdtOaYvADMO41A1FEt5ffd4FIMrWiDtgSYccl2dkS1UoiwWfCfF1c45FIFv3vdLlIEK9QN3E18GbyByUBDjKTGn7jQU9KYKp1AmPXKW3c336mniALrsb8RGN9iH_-1TBWVczWi6noQ31v0Pdf_eAn4uBpKMwbo",
        rating: 4.7,
        review_count: 89,
        location: {
            city: "London",
            country: "UK",
            address: "10 Downing St, London SW1A 2AA",
            lat: 51.5074,
            lng: -0.1278,
            distance_km: null
        },
        description: "Award-winning international PR and branding experts. We help brands find their unique voice and reach global audiences.",
        services: [
            { name: "International PR", description: "Global media outreach", price_from: 3000 },
            { name: "Brand Strategy", description: "Positioning & Messaging", price_from: 2500 }
        ],
        tags: ["PR", "Branding", "International"],
        verified: true,
        is_registered: true,
        is_pro: false,
        website: "https://globalreach.example.com",
        phone: "+44 20 7946 0958",
        pricing: {
            starting_monthly: 1500,
            hourly_rate: 200
        },
        stats: {
            avg_roas: "250%",
            years_experience: 15,
            clients_served: 180
        },
        budget_level: "$$$$",
        focus: "Enterprise"
    },
    {
        id: "creative-cloud-agency",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frY6",
        name: "Creative Cloud",
        logo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLTyB-uwFC5zQsrGFXGoLX7xiKRCeaGmXR-XKifPbeq5VSklVZyqPRtKCttmjSHZcfveORIlJXAWfcnYFKFZSUNJWqRzVnGfpCVsj1UfN380ZXvDOF6bICmURZ_hiuEcc5MZ5VpYFeQU9ltBvlkxvmUdUTrwrMss_sGCrqDSS1BhjTUZwbIigEPZNEHjWJdrVWmBh2HlLLPltUKYqKiyKQvOyHIDRG3kVbJaq7vRW2UrTAVpU5gtt9EA9z2VpOJWloBLt7zEYHS_Y",
        cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Qai837ahDx516H_xfIovJj_Uzl_-BBtfimdx5srwOz-ZxgL1VRpnDl4m-tLaKmo2rfyF9RyHkkdtkkUZ_XtmoRYWlrY5-CsWM_umfqUneVBH85ZHe8ZYkq4ra3xJ9jN31Ozjj2JubDyInVZdY_Te_9ihjurIleEfccVR0mbkCaxwHOg2joyOFVVqjU2strtOLgvP7mj6KU6Xwf1jKm_VjUEn8YueR_9wAKIJ3m4qtrACofL9YlTBoA1TY--q5wnWe4yNx4n2sbs",
        rating: 4.5,
        review_count: 85,
        location: {
            city: "London",
            country: "UK",
            address: "221B Baker St, London NW1 6XE",
            lat: 51.5238,
            lng: -0.1585,
            distance_km: null
        },
        description: "Award-winning branding and social media management experts. We help brands find their unique voice.",
        services: [
            { name: "Branding", description: "Visual identity & guidelines", price_from: 2000 },
            { name: "Social Media", description: "Content creation & management", price_from: 1500 }
        ],
        tags: ["Branding", "Social Media", "Design"],
        verified: true,
        is_registered: true,
        is_pro: false,
        website: "https://creativecloud.example.com",
        phone: "+44 20 7123 4567",
        pricing: {
            starting_monthly: 1500,
            hourly_rate: 120
        },
        stats: {
            avg_roas: "200%",
            years_experience: 8,
            clients_served: 120
        },
        budget_level: "$$",
        focus: "Small Business"
    },
    {
        id: "elevate-media",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frY7",
        name: "Elevate Media",
        logo_url: null,
        cover_image: null,
        rating: 4.2,
        review_count: 42,
        location: {
            city: "Austin",
            country: "USA",
            address: "1100 Congress Ave, Austin, TX 78701",
            lat: 30.2747,
            lng: -97.7404,
            distance_km: 2850
        },
        description: "Full-service marketing for local businesses. Web design, local SEO, and print marketing solutions.",
        services: [
            { name: "Local SEO", description: "Google My Business & Citations", price_from: 500 },
            { name: "Web Design", description: "Responsive websites", price_from: 2000 }
        ],
        tags: ["Local SEO", "Web Design", "Print"],
        verified: false,
        is_registered: false,
        is_pro: false,
        website: "https://elevatemedia.example.com",
        phone: "+1 (512) 555-7890",
        pricing: {
            starting_monthly: 800,
            hourly_rate: 75
        },
        stats: {
            avg_roas: "180%",
            years_experience: 5,
            clients_served: 80
        },
        budget_level: "$",
        focus: "Local Business"
    },
    {
        id: "studio-45",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frY8",
        name: "Studio 45",
        logo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVhzqvMOt80M9XW4bofnh5HBbFUbHpjsbSrvVq8R5dqIqjgstg8QGvu6G8180SfW9LCZ94V_rqLhAp0rnV24tscmcdnPjauZo3mFGvRyo6bsH2nhe5tbVd8bxhy1lk-FJgX6JYrhXqwyVDuCU2ODH8OnN6YmEqbkZEk_KFgrAmAfk2JUgj3GmOakNjc8cghJQ5GXUdSZSEkKRqyc4FINbUksJYgoBl6gVHBoIbYkn4Qh0TyLB3OJtavPJNiRgCTsbrCD6p-TZsESI",
        cover_image: null,
        rating: 5.0,
        review_count: 204,
        location: {
            city: "London",
            country: "UK",
            address: "45 Oxford St, London W1D 2DZ",
            lat: 51.5155,
            lng: -0.1309,
            distance_km: null
        },
        description: "Elite marketing boutique recognized globally for excellence. Top 1% rated agency worldwide.",
        services: [
            { name: "Full-Service Marketing", description: "End-to-end campaigns", price_from: 5000 },
            { name: "Strategy Consulting", description: "CMO-level guidance", price_from: 3000 }
        ],
        tags: ["Marketing", "Strategy", "Premium"],
        verified: true,
        is_registered: true,
        is_pro: true,
        website: "https://studio45.example.com",
        phone: "+44 20 7890 1234",
        pricing: {
            starting_monthly: 5000,
            hourly_rate: 250
        },
        stats: {
            avg_roas: "450%",
            years_experience: 20,
            clients_served: 300
        },
        budget_level: "$$$$",
        focus: "Enterprise"
    },
    {
        id: "growth-gurus",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frY9",
        name: "Growth Gurus",
        logo_url: null,
        cover_image: null,
        rating: 4.7,
        review_count: 89,
        location: {
            city: "New York",
            country: "USA",
            address: "200 Park Ave, New York, NY 10166",
            lat: 40.7549,
            lng: -73.9768,
            distance_km: 3.1
        },
        description: "Data-driven growth marketing with expertise in social media strategy and influencer partnerships.",
        services: [
            { name: "Social Media Strategy", description: "Platform-specific campaigns", price_from: 1500 },
            { name: "Influencer Outreach", description: "Partnership management", price_from: 2000 }
        ],
        tags: ["Social Media", "Influencer", "Growth"],
        verified: true,
        is_registered: true,
        is_pro: false,
        website: "https://growthgurus.example.com",
        phone: "+1 (212) 555-9876",
        pricing: {
            starting_monthly: 1500,
            hourly_rate: 125
        },
        stats: {
            avg_roas: "280%",
            years_experience: 7,
            clients_served: 150
        },
        budget_level: "$$$",
        focus: "E-commerce"
    },
    {
        id: "nexgen-media",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frYA",
        name: "NexGen Media",
        logo_url: null,
        cover_image: null,
        rating: 4.5,
        review_count: 42,
        location: {
            city: "New York",
            country: "USA",
            address: "1 World Trade Center, New York, NY 10007",
            lat: 40.7127,
            lng: -74.0134,
            distance_km: 5.2
        },
        description: "Budget-friendly marketing solutions with focus on email marketing and basic analytics.",
        services: [
            { name: "Email Marketing", description: "Campaigns & automation", price_from: 500 },
            { name: "Analytics Setup", description: "GA4 & tracking", price_from: 300 }
        ],
        tags: ["Email", "Analytics", "Budget"],
        verified: true,
        is_registered: true,
        is_pro: false,
        website: "https://nexgenmedia.example.com",
        phone: "+1 (212) 555-4321",
        pricing: {
            starting_monthly: 900,
            hourly_rate: 80
        },
        stats: {
            avg_roas: "150%",
            years_experience: 3,
            clients_served: 60
        },
        budget_level: "$",
        focus: "Startups"
    }
]

// Mock reviews data
export const mockReviews = [
    {
        id: "review-1",
        agency_id: "apex-digital-strategies",
        user_name: "Jane Doe",
        user_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrFQKvKU9MABXj4imKk_2Fh-cxj7rhQCjsKLh59tIPB3HNQ516vA8gzu7cAL_l4saAJaXdX8ZjSqOzACjHUL9DWRmwaLm8wSOrYWO_fiyHZlS4I0B_M_jKVn6EzDj846hMFXaauLfcQAmTIm5UGxULTW-E63--EpqguNknH9i73oIuMzy3lOem1ZfRrEawNuqB2K7-FTjBpxRapNs2wbOemfoXU-Xiyr2_A2yNuo8b2WkoBmIUPuCw0SzOtyZAKJu_jFKG7geT05I",
        rating: 5,
        text: "Incredible ROI on our PPC campaign. The team was responsive and provided detailed weekly reports that helped us optimize our spend efficiently. Highly recommended for any e-commerce business looking to scale.",
        service_tag: "PPC",
        helpful_count: 12,
        created_at: "2024-12-23T10:00:00Z"
    },
    {
        id: "review-2",
        agency_id: "apex-digital-strategies",
        user_name: "Startup Inc.",
        user_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLiQzZXogwiaCaMDSS1qdEJdaCN6ZtGkhQrUvT3osi1NVPvhMNulcMlZTwT07nBEg9JHhBo9eGw8N4B5NTcqE9ZspXmVpLhDjkNo6WoLuTtU_tamKhGt2PLrW07hh7hNINuauT_H4dRfLYwYW1TW5XPpk4CYpvID9usgY4Cx26IID6SrzYwhYeQRMD_aosgGaGNUI0EpvJ1mCMvavUacbzM0dIrMZSTzsxDaSBz1GltPu5Y2OicTDXMGrrJVgZJ6sh-5SlD3hA87s",
        rating: 4,
        text: "Great communication, but slightly over budget compared to the initial quote. The results were solid, but make sure to clarify all potential extra costs upfront.",
        service_tag: "Branding",
        helpful_count: 5,
        created_at: "2024-12-18T14:30:00Z"
    },
    {
        id: "review-3",
        agency_id: "apex-digital-strategies",
        user_name: "Tech Solutions",
        user_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6Qw9CauodT3Z0TRMNMJGZz7Wd5WO4a7pxNENtzEJ3gysPrDkYXguoNOiEB9X3P4Flj1BKzn1irJVoK3d3He6YfJDCzYYDxgLLGS95CJpkd_WSH_psKZYoZju7SlBGxAYsy4UaQeL5ur4TbHIKEU3RiwwA27f8_zKQqShNhvWKzOdAloUNIeoZmBIzEZG4-0KIUUmHXecXkn7lMs_DhitzSk6Zc4h-v3_7-36BMt636FJIUxteCNzvSxYBVpFODkYkGlWR1KtkWU",
        rating: 5,
        text: "Best SEO agency we've worked with. Our organic traffic increased by 200% in just three months. Their technical audit was incredibly thorough and the team executed flawlessly on the content strategy.",
        service_tag: "SEO",
        helpful_count: 8,
        created_at: "2024-12-04T09:15:00Z"
    },
    {
        id: "review-4",
        agency_id: "apex-digital-strategies",
        user_name: "Sarah M.",
        user_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVsk_Lh55y0E0heJ4urBYOVQ-HTRd4skxKckV8OYmryeCr0ljRe7J42n2DzVdcKCY7k898BFKH396_QXJF3p-E2vhD_3jafxgiZ7T1ERo_oyamR2ql2wLSSQSKF7wd9BvPUCL068BLPkHDzmS6Igv6_odMTy5MAKXds4GC5arpRN6knjNrQFgpLIwNKWKkOiZZHNf0cA-wp1WwkiClb0CBzQf_y8aj_v1O2FE1jZmcAmr008ZJBh6cfi2-92j19c8WBPlfeEa3kXU",
        rating: 3,
        text: "Decent service, but the turnaround time for posts was longer than expected.",
        service_tag: "Social Media",
        helpful_count: 2,
        created_at: "2024-11-25T16:45:00Z"
    }
]

// Categories for filtering
export const categories = [
    { id: "seo", name: "SEO", icon: "search", color: "blue" },
    { id: "ads", name: "Ads", icon: "campaign", color: "purple" },
    { id: "design", name: "Design", icon: "palette", color: "orange" },
    { id: "social", name: "Social", icon: "public", color: "pink" },
    { id: "email", name: "Email", icon: "mail", color: "emerald" },
    { id: "dev", name: "Dev", icon: "code", color: "cyan" },
    { id: "video", name: "Video", icon: "videocam", color: "rose" },
    { id: "more", name: "More", icon: "grid_view", color: "gray" }
]
