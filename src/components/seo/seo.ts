interface SEOMetadata {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
}

const allKeywords = [
    'sports tipping',
    'sports fans',
    'best nil deals',
    'sports fan engagement',
    'gender pay gap in sports',
    'college sports',
    'support athletes',
    'sports community',
    'fan engagement platform',
    'fan appreciation',
    'nil deals for college athletes',
    'nil tipping'
];


const baseMetadata: SEOMetadata = {
    title: 'PROTIPPZ',
    description: 'Join the PROTIPPZ sports community for fan engagement and NIL deals',
    keywords: allKeywords,
    canonicalUrl: 'https://protippz.com',
    ogImage: 'https://i.ibb.co.com/cXf1gL5/image-1.png'
};

export const getSEOMetadata = (pageType: string): SEOMetadata => {
    switch (pageType) {
        case 'home':
            return {
                ...baseMetadata,
                title: 'PROTIPPZ | Sports Fan Engagement Platform & NIL Deals',
                description: 'Join PROTIPPZ sports community for sports tipping, fan engagement, and the best NIL deals for college athletes.',
                keywords: allKeywords
            };
        case 'nilDeals':
            return {
                ...baseMetadata,
                title: 'Best NIL Deals for College Athletes | PROTIPPZ',
                description: 'Discover the best NIL deals for college athletes. Support athletes through NIL tipping and fan engagement on PROTIPPZ.',
                keywords: ['best nil deals', 'nil deals for college athletes', 'nil tipping', 'support athletes', 'college sports']
            };
        case 'fanEngagement':
            return {
                ...baseMetadata,
                title: 'Sports Fan Engagement Platform | PROTIPPZ',
                description: 'Connect with your favorite sports community through our fan engagement platform. Show fan appreciation and support your favorite athletes.',
                keywords: ['sports fan engagement', 'fan engagement platform', 'sports fans', 'sports community', 'fan appreciation']
            };
        case 'sportsTipping':
            return {
                ...baseMetadata,
                title: 'Sports Tipping & Fan Support | PROTIPPZ',
                description: 'Participate in sports tipping and support your favorite athletes. Join our sports community for the best fan engagement experience.',
                keywords: ['sports tipping', 'nil tipping', 'support athletes', 'sports fans', 'sports community']
            };
        case 'genderPayGap':
            return {
                ...baseMetadata,
                title: 'Gender Pay Gap in Sports | PROTIPPZ',
                description: 'Learn about and help address the gender pay gap in sports. Support athletes equally through our fan engagement platform.',
                keywords: ['gender pay gap in sports', 'support athletes', 'sports community', 'fan engagement platform']
            };
        case 'collegeAthletes':
            return {
                ...baseMetadata,
                title: 'College Sports & NIL Support | PROTIPPZ',
                description: 'Support college sports athletes through NIL deals and tipping. Join our fan engagement platform to show appreciation for college athletes.',
                keywords: ['college sports', 'nil deals for college athletes', 'support athletes', 'fan appreciation', 'sports fans']
            };
        default:
            return baseMetadata;
    }
};