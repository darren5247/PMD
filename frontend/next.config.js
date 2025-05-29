/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pianodbcms.s3.amazonaws.com'
      }
    ]
  },
  async redirects() {
    return [
      //Table of Contents: --START
      //Homepage
      //Works
      //Collections
      //Composers
      //Publishers
      //Collections
      //Elements
      //Add A Work Form
      //Works Added
      //Add A Collection Form
      //Collections Added
      //Add A Composer Form
      //Composers Added
      //Add A Publisher Form
      //Publisher Added
      //Lists
      //Favorites
      //Edit History
      //Accounts - Log In
      //Accounts - Create Account
      //Accounts - Request/Reset Email/Password
      //Accounts - Other (Dashboard, Settings, etc)
      //List Your Music
      //Demo/Tour
      //Newsletter
      //About
      //Subscribe/PMD Plus
      //Donate
      //Press Kit
      //Jobs
      //Contact
      //Help/FAQ/Tutorials
      //Legal - Terms and Conditions
      //Legal - Privacy Policy
      //Legal - Cookie Policy
      //Legal - Affiliate Disclosure
      //Legal - Impressum
      //Fix - MACM
      //Fix - MRPW
      //Table of Contents --END

      //Homepage
      {
        source: '/index',
        destination: '/',
        permanent: true
      },
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/homepage',
        destination: '/',
        permanent: true
      },
      //Works
      {
        source: '/works',
        destination: '/search',
        permanent: true
      },
      {
        source: '/pieces',
        destination: '/search',
        permanent: true
      },
      {
        source: '/db',
        destination: '/search',
        permanent: true
      },
      {
        source: '/data',
        destination: '/search',
        permanent: true
      },
      {
        source: '/database',
        destination: '/search',
        permanent: true
      },
      {
        source: "/all-works",
        destination: "/search",
        permanent: true
      },
      {
        source: "/allworks",
        destination: "/search",
        permanent: true
      },
      {
        source: '/work/:slug(\\d{1,})',
        destination: '/work/redirectedTo:slug?id=:slug',
        permanent: false
      },
      //Composers
      {
        source: '/composer/:slug(\\d{1,})',
        destination: '/composer/redirectedTo:slug?id=:slug',
        permanent: false
      },
      {
        source: "/all-composers",
        destination: "/composers",
        permanent: true
      },
      {
        source: "/allcomposers",
        destination: "/composers",
        permanent: true
      },
      //Publishers
      {
        source: '/publisher/:slug(\\d{1,})',
        destination: '/publisher/redirectedTo:slug?id=:slug',
        permanent: false
      },
      {
        source: "/all-publishers",
        destination: "/publishers",
        permanent: true
      },
      {
        source: "/allpublishers",
        destination: "/publishers",
        permanent: true
      },
      //Collections
      {
        source: '/collection/:slug(\\d{1,})',
        destination: '/collection/redirectedTo:slug?id=:slug',
        permanent: false
      },
      {
        source: "/all-collections",
        destination: "/collections",
        permanent: true
      },
      {
        source: "/allcollections",
        destination: "/collections",
        permanent: true
      },
      //Elements
      {
        source: '/element/:slug(\\d{1,})',
        destination: '/element/redirectedTo:slug?id=:slug',
        permanent: false
      },
      {
        source: "/all-elements",
        destination: "/elements",
        permanent: true
      },
      {
        source: "/allelements",
        destination: "/elements",
        permanent: true
      },
      //Add A Work Form
      {
        source: "/add-piece",
        destination: "/add-work",
        permanent: true
      },
      {
        source: "/addpiece",
        destination: "/add-work",
        permanent: true
      },
      {
        source: "/add-a-work",
        destination: "/add-work",
        permanent: true
      },
      {
        source: "/addwork",
        destination: "/add-work",
        permanent: true
      },
      {
        source: "/work-add",
        destination: "/add-work",
        permanent: true
      },
      {
        source: "/workadd",
        destination: "/add-work",
        permanent: true
      },
      {
        source: "/ad-work",
        destination: "/add-work",
        permanent: true
      },
      //Works Added
      {
        source: "/my-works",
        destination: "/works-added",
        permanent: true
      },
      {
        source: "/myworks",
        destination: "/works-added",
        permanent: true
      },
      {
        source: "/your-works",
        destination: "/works-added",
        permanent: true
      },
      {
        source: "/yourworks",
        destination: "/works-added",
        permanent: true
      },
      {
        source: "/added-works",
        destination: "/works-added",
        permanent: true
      },
      {
        source: "/addedworks",
        destination: "/works-added",
        permanent: true
      },
      //Add A Collection Form
      {
        source: "/add-piece",
        destination: "/add-collection",
        permanent: true
      },
      {
        source: "/addpiece",
        destination: "/add-collection",
        permanent: true
      },
      {
        source: "/add-a-collection",
        destination: "/add-collection",
        permanent: true
      },
      {
        source: "/addcollection",
        destination: "/add-collection",
        permanent: true
      },
      {
        source: "/collection-add",
        destination: "/add-collection",
        permanent: true
      },
      {
        source: "/collectionadd",
        destination: "/add-collection",
        permanent: true
      },
      {
        source: "/ad-collection",
        destination: "/add-collection",
        permanent: true
      },
      //Collections Added
      {
        source: "/my-collections",
        destination: "/collections-added",
        permanent: true
      },
      {
        source: "/mycollections",
        destination: "/collections-added",
        permanent: true
      },
      {
        source: "/your-collections",
        destination: "/collections-added",
        permanent: true
      },
      {
        source: "/yourcollections",
        destination: "/collections-added",
        permanent: true
      },
      {
        source: "/added-collections",
        destination: "/collections-added",
        permanent: true
      },
      {
        source: "/addedcollections",
        destination: "/collections-added",
        permanent: true
      },
      //Add A Composer Form
      {
        source: "/add-piece",
        destination: "/add-composer",
        permanent: true
      },
      {
        source: "/addpiece",
        destination: "/add-composer",
        permanent: true
      },
      {
        source: "/add-a-composer",
        destination: "/add-composer",
        permanent: true
      },
      {
        source: "/addcomposer",
        destination: "/add-composer",
        permanent: true
      },
      {
        source: "/composer-add",
        destination: "/add-composer",
        permanent: true
      },
      {
        source: "/composeradd",
        destination: "/add-composer",
        permanent: true
      },
      {
        source: "/ad-composer",
        destination: "/add-composer",
        permanent: true
      },
      //Composers Added
      {
        source: "/my-composers",
        destination: "/composers-added",
        permanent: true
      },
      {
        source: "/mycomposers",
        destination: "/composers-added",
        permanent: true
      },
      {
        source: "/your-composers",
        destination: "/composers-added",
        permanent: true
      },
      {
        source: "/yourcomposers",
        destination: "/composers-added",
        permanent: true
      },
      {
        source: "/added-composers",
        destination: "/composers-added",
        permanent: true
      },
      {
        source: "/addedcomposers",
        destination: "/composers-added",
        permanent: true
      },
      //Add A Publisher Form
      {
        source: "/add-piece",
        destination: "/add-publisher",
        permanent: true
      },
      {
        source: "/addpiece",
        destination: "/add-publisher",
        permanent: true
      },
      {
        source: "/add-a-publisher",
        destination: "/add-publisher",
        permanent: true
      },
      {
        source: "/addpublisher",
        destination: "/add-publisher",
        permanent: true
      },
      {
        source: "/publisher-add",
        destination: "/add-publisher",
        permanent: true
      },
      {
        source: "/publisheradd",
        destination: "/add-publisher",
        permanent: true
      },
      {
        source: "/ad-publisher",
        destination: "/add-publisher",
        permanent: true
      },
      //Publishers Added
      {
        source: "/my-publishers",
        destination: "/publishers-added",
        permanent: true
      },
      {
        source: "/mypublishers",
        destination: "/publishers-added",
        permanent: true
      },
      {
        source: "/your-publishers",
        destination: "/publishers-added",
        permanent: true
      },
      {
        source: "/yourpublishers",
        destination: "/publishers-added",
        permanent: true
      },
      {
        source: "/added-publishers",
        destination: "/publishers-added",
        permanent: true
      },
      {
        source: "/addedpublishers",
        destination: "/publishers-added",
        permanent: true
      },
      //Lists
      {
        source: "/my-lists",
        destination: "/lists-created",
        permanent: true
      },
      {
        source: "/mylists",
        destination: "/lists-created",
        permanent: true
      },
      {
        source: "/your-lists",
        destination: "/lists-created",
        permanent: true
      },
      {
        source: "/yourlists",
        destination: "/lists-created",
        permanent: true
      },
      {
        source: "/all-lists",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/alllists",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/discover-lists",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/discoverlists",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/lists-discover",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/listsdiscover",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/discover-list",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/discoverlist",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/list-discover",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/listdiscover",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/list-discovery",
        destination: "/lists",
        permanent: true
      },
      {
        source: "/listdiscovery",
        destination: "/lists",
        permanent: true
      },
      {
        source: '/list/:slug(\\d{1,})',
        destination: '/list/redirectedTo:slug?id=:slug',
        permanent: false
      },
      {
        source: '/lists/:slug(\\d{1,})',
        destination: '/list/redirectedToFromSlashLists:slug?id=:slug',
        permanent: false
      },
      //Favorites
      {
        source: "/fav",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/fave",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/favs",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/faves",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/favorite",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/my-favorites",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/myfavorites",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/your-favorites",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/yourfavorites",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/all-favorites",
        destination: "/favorites",
        permanent: true
      },
      {
        source: "/allfavorites",
        destination: "/favorites",
        permanent: true
      },
      //Edit History
      {
        source: "/edits",
        destination: "/edit-history",
        permanent: true
      },
      {
        source: "/editshistory",
        destination: "/edit-history",
        permanent: true
      },
      {
        source: "/edits-history",
        destination: "/edit-history",
        permanent: true
      },
      {
        source: "/edithistory",
        destination: "/edit-history",
        permanent: true
      },
      //Accounts - Log In
      {
        source: "/sign-on",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/signon",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/sign-in",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/signin",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/log-on",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/logon",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/login",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/login",
        destination: "/log-in",
        permanent: true
      },
      {
        source: "/loginconfirm",
        destination: "/log-in-confirmed",
        permanent: true
      },
      {
        source: "/log-in-confirm",
        destination: "/log-in-confirmed",
        permanent: true
      },
      {
        source: "/log-inconfirm",
        destination: "/log-in-confirmed",
        permanent: true
      },
      {
        source: "/login-confirm",
        destination: "/log-in-confirmed",
        permanent: true
      },
      {
        source: "/loginconfirmed",
        destination: "/log-in-confirmed",
        permanent: true
      },
      {
        source: "/login-confirmed",
        destination: "/log-in-confirmed",
        permanent: true
      },
      {
        source: "/log-inconfirmed",
        destination: "/log-in-confirmed",
        permanent: true
      },
      //Accounts - Create Account
      {
        source: "/createaccount",
        destination: "/create-account",
        permanent: true
      },
      {
        source: "/createacc",
        destination: "/create-account",
        permanent: true
      },
      {
        source: "/create-acc",
        destination: "/create-account",
        permanent: true
      },
      {
        source: "/register",
        destination: "/create-account",
        permanent: true
      },
      //Accounts - Request/Reset Email/Password
      {
        source: "/forgotemail",
        destination: "/forgot-email",
        permanent: true
      },
      {
        source: "/forgot-password",
        destination: "/request-password",
        permanent: true
      },
      {
        source: "/forgotpassword",
        destination: "/request-password",
        permanent: true
      },
      {
        source: "/new-password",
        destination: "/request-password",
        permanent: true
      },
      {
        source: "/newpassword",
        destination: "/request-password",
        permanent: true
      },
      {
        source: "/requestpassword",
        destination: "/request-password",
        permanent: true
      },
      {
        source: "/password-request",
        destination: "/request-password",
        permanent: true
      },
      {
        source: "/passwordrequest",
        destination: "/request-password",
        permanent: true
      },
      {
        source: "/password-reset",
        destination: "/reset-password",
        permanent: true
      },
      {
        source: "/passwordreset",
        destination: "/reset-password",
        permanent: true
      },
      {
        source: "/resetpassword",
        destination: "/reset-password",
        permanent: true
      },
      //Accounts - Other (Dashboard, Settings, etc)
      {
        source: "/dashboard",
        destination: "/account-dashboard",
        permanent: true
      },
      {
        source: "/account",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/accountdashboard",
        destination: "/account-dashboard",
        permanent: true
      },
      {
        source: "/profile-settings",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/settings",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/profile",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/profile-settings",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/accountsettings",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/accountsettings",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/setup",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/account-setup",
        destination: "/account-settings",
        permanent: true
      },
      {
        source: "/accountsetup",
        destination: "/account-settings",
        permanent: true
      },
      //List Your Music
      {
        source: '/listyourmusic',
        destination: '/list-your-music',
        permanent: true
      },
      {
        source: '/listmymusic',
        destination: '/list-your-music',
        permanent: true
      },
      {
        source: '/list-my-music',
        destination: '/list-your-music',
        permanent: true
      },
      {
        source: '/listmusic',
        destination: '/list-your-music',
        permanent: true
      },
      {
        source: '/list-music',
        destination: '/list-your-music',
        permanent: true
      },
      //Demo/Tour
      {
        source: '/demo',
        destination: 'https://app.arcade.software/share/0XoxfPB8ML6Ges5GhVPb',
        permanent: false
      },
      {
        source: '/tour',
        destination: 'https://app.arcade.software/share/0XoxfPB8ML6Ges5GhVPb',
        permanent: false
      },
      {
        source: '/arcade',
        destination: 'https://app.arcade.software/share/0XoxfPB8ML6Ges5GhVPb',
        permanent: false
      },
      //Newsletter
      {
        source: '/emails',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: "/sign-up",
        destination: "/newsletter",
        permanent: true
      },
      {
        source: "/signup",
        destination: "/newsletter",
        permanent: true
      },
      {
        source: '/emailnewsletter',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/email-newsletter',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/newsletter-emails',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/communication-preferences',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/communicationpreferences',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/communication',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/subscribe',
        destination: '/newsletter',
        permanent: false
      },
      {
        source: '/unsubscribe',
        destination: '/newsletter',
        permanent: false
      },
      {
        source: '/the-week-at-pmd',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/theweekatpmd',
        destination: '/newsletter',
        permanent: true
      },
      //About
      {
        source: '/about-us',
        destination: '/about',
        permanent: true
      },
      {
        source: '/aboutus',
        destination: '/about',
        permanent: true
      },
      //Subscribe/PMD Plus
      {
        source: '/subscription',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/subscriptions',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/manage-plan',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/manageplan',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/manage-plans',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/manageplans',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/manage-subscription',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/managesubscription',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/manage-subscriptions',
        destination: '/plan',
        permanent: true
      },
      {
        source: '/managesubscriptions',
        destination: '/plan',
        permanent: true
      },
      //Donate
      {
        source: '/donate',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/donation',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/donations',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/donation',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/donator',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/donators',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/sponsor',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/sponsors',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/contribute',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/contribution',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      {
        source: '/contributions',
        destination: 'https://donate.stripe.com/00g2azbkE37v62c001',
        permanent: true
      },
      //Press Kit
      {
        source: '/media',
        destination: '/press',
        permanent: true
      },
      {
        source: '/mediakit',
        destination: '/press',
        permanent: true
      },
      {
        source: '/media-kit',
        destination: '/press',
        permanent: true
      },
      {
        source: '/presskit',
        destination: '/press',
        permanent: true
      },
      {
        source: '/press-kit',
        destination: '/press',
        permanent: true
      },
      //Jobs
      {
        source: '/job',
        destination: '/jobs',
        permanent: true
      },
      {
        source: '/career',
        destination: '/jobs',
        permanent: true
      },
      {
        source: '/careers',
        destination: '/jobs',
        permanent: true
      },
      {
        source: '/apply',
        destination: '/jobs',
        permanent: true
      },
      {
        source: '/application',
        destination: '/jobs',
        permanent: true
      },
      {
        source: '/hiring',
        destination: '/jobs',
        permanent: true
      },
      //Contact
      {
        source: '/contactus',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/email',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/message',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/contacts',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/social-media',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/socialmedia',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/socials',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/links',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/share',
        destination: '/contact',
        permanent: true
      },
      //Legal - Help/FAQ/Tutorials
      {
        source: '/helpcenter',
        destination: '/help',
        permanent: true
      },
      {
        source: '/help-center',
        destination: '/help',
        permanent: true
      },
      {
        source: '/helpme',
        destination: '/help',
        permanent: true
      },
      {
        source: '/help-me',
        destination: '/help',
        permanent: true
      },
      {
        source: '/support',
        destination: '/help',
        permanent: true
      },
      {
        source: '/learn',
        destination: '/help',
        permanent: true
      },
      {
        source: '/learnmore',
        destination: '/help',
        permanent: true
      },
      {
        source: '/learn-more',
        destination: '/help',
        permanent: true
      },
      {
        source: '/info',
        destination: '/help',
        permanent: true
      },
      {
        source: '/information',
        destination: '/help',
        permanent: true
      },
      {
        source: '/fag',
        destination: '/faq',
        permanent: true
      },
      {
        source: '/frequentlyaskedquestions',
        destination: '/faq',
        permanent: true
      },
      {
        source: '/frequently-asked-questions',
        destination: '/faq',
        permanent: true
      },
      {
        source: '/questions',
        destination: '/faq',
        permanent: true
      },
      {
        source: '/ask',
        destination: '/faq',
        permanent: true
      },
      {
        source: '/tuts',
        destination: '/tutorials',
        permanent: true
      },
      {
        source: '/tutorial',
        destination: '/tutorials',
        permanent: true
      },
      {
        source: '/how',
        destination: '/tutorials',
        permanent: true
      },
      {
        source: '/how-to',
        destination: '/tutorials',
        permanent: true
      },
      {
        source: '/howto',
        destination: '/tutorials',
        permanent: true
      },
      {
        source: '/howtos',
        destination: '/tutorials',
        permanent: true
      },
      {
        source: '/how-tos',
        destination: '/tutorials',
        permanent: true
      },
      {
        source: '/accounthelp',
        destination: '/tutorial-create-account',
        permanent: true
      },
      {
        source: '/account-help',
        destination: '/tutorial-create-account',
        permanent: true
      },
      {
        source: '/howtocreateaccount',
        destination: '/tutorial-create-account',
        permanent: true
      },
      {
        source: '/tutorialcreateaccount',
        destination: '/tutorial-create-account',
        permanent: true
      },
      {
        source: '/tutorialgettingstarted',
        destination: '/tutorial-getting-started',
        permanent: true
      },
      {
        source: '/getting-started',
        destination: '/tutorial-getting-started',
        permanent: true
      },
      {
        source: '/gettingstarted',
        destination: '/tutorial-getting-started',
        permanent: true
      },
      {
        source: '/starting',
        destination: '/tutorial-getting-started',
        permanent: true
      },
      {
        source: '/start',
        destination: '/tutorial-getting-started',
        permanent: true
      },
      //Legal - Terms and Conditions
      {
        source: '/tos',
        destination: '/terms-and-conditions',
        permanent: true
      },
      {
        source: '/termsandconditions',
        destination: '/terms-and-conditions',
        permanent: true
      },
      {
        source: '/termsconditions',
        destination: '/terms-and-conditions',
        permanent: true
      },
      {
        source: '/terms-conditions',
        destination: '/terms-and-conditions',
        permanent: true
      },
      {
        source: '/accept-terms',
        destination: '/terms-and-conditions',
        permanent: true
      },
      //Legal - Privacy Policy
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true
      },
      {
        source: '/privacypolicy',
        destination: '/privacy-policy',
        permanent: true
      },
      //Legal - Cookie Policy
      {
        source: '/cookie',
        destination: '/cookie-policy',
        permanent: true
      },
      {
        source: '/cookies',
        destination: '/cookie-policy',
        permanent: true
      },
      {
        source: '/cookiepolicy',
        destination: '/cookie-policy',
        permanent: true
      },
      //Legal - Affiliate Disclosure
      {
        source: '/affiliates',
        destination: '/affiliate-disclosure',
        permanent: true
      },
      {
        source: '/affiliatedisclosure',
        destination: '/affiliate-disclosure',
        permanent: true
      },
      //Legal - Impressum
      {
        source: '/regulations',
        destination: '/impressum',
        permanent: true
      },
      {
        source: '/regulatory-disclosure',
        destination: '/impressum',
        permanent: true
      },
      {
        source: '/regulatorydisclosure',
        destination: '/impressum',
        permanent: true
      },
      {
        source: '/statutory-disclosure',
        destination: '/impressum',
        permanent: true
      },
      {
        source: '/statutorydisclosure',
        destination: '/impressum',
        permanent: true
      },
      //Fix - From the World of Legends
      {
        source: '/from-the-world-of-legends',
        destination: '/work/From%20the%20World%20of%20Legends%20Op.%20107%2C%20No.%2019-Carl%20Reinecke?id=2072&utm_source=fbgroup&utm_medium=social&utm_campaign=groupintro',
        permanent: false
      },
      //Fix - MACM
      {
        source: '/10-graded-piano-pieces-by-maltese-composers',
        destination: '/collection/10-graded-piano-pieces-by-maltese-composers?id=104',
        permanent: false
      },
      {
        source: '/10gradedpianopiecesbymaltesecomposers',
        destination: '/collection/10-graded-piano-pieces-by-maltese-composers?id=104',
        permanent: false
      },
      {
        source: '/macm',
        destination: '/collection/10-graded-piano-pieces-by-maltese-composers?id=104',
        permanent: false
      },
      {
        source: '/macm-download',
        destination: '/collection/10-graded-piano-pieces-by-maltese-composers?id=104',
        permanent: false
      },
      //Fix - MRPW
      {
        source: '/max-richter-piano-works',
        destination: '/collection/max-richter-piano-works?id=118',
        permanent: false
      },
      {
        source: '/maxrichterpianoworks',
        destination: '/collection/max-richter-piano-works?id=118',
        permanent: false
      },
      {
        source: '/mrpw',
        destination: '/collection/max-richter-piano-works?id=118',
        permanent: false
      },
      {
        source: '/maxrichterpianoworks',
        destination: '/collection/max-richter-piano-works?id=118',
        permanent: false
      },
      {
        source: '/maxrichter-pianoworks',
        destination: '/collection/max-richter-piano-works?id=118',
        permanent: false
      },
      //Search
      {
        source: '/calm',
        destination: '/search?musicWorks%5BrefinementList%5D%5Bmoods%5D%5B0%5D=Dreamy&musicWorks%5BrefinementList%5D%5Bmoods%5D%5B1%5D=Relaxing&musicWorks%5BrefinementList%5D%5Bmoods%5D%5B2%5D=Tranquil',
        permanent: false
      },
    ]
  }
};

module.exports = nextConfig;
