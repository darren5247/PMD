import { IUserAttributes } from "./user";

export interface IStrapiPiece {
  id: number;
  attributes: {
    title: string;
    alternateTitle: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    adminReview: string;
    isFeatured: string;
    popularPiecesIndex: number;
    promoText: string;
    description: string;
    urlSpotify: string;
    urlAppleMusic: string;
    edits: {
      data: IStrapiEdit[] | null;
    };
    composers: {
      data: IStrapiComposer[] | null;
    };
    level: {
      data: {
        attributes: {
          title: string;
        };
      } | null;
    };
    elements: {
      data: IStrapiElement[] | null;
    };
    collections: {
      data: IStrapiCollection[] | null;
    };
    sheetMusicLinks:
      | [
          {
            id: number;
            sellerName: string;
            url: string;
            linkText: string;
            sellerImage: {
              data: {
                attributes: {
                  name: string;
                  url: string;
                  width: number;
                  height: number;
                };
              };
            };
          },
        ]
      | null;
    score: {
      data: {
        id: number;
        attributes: {
          url: string;
        };
      } | null;
    };
    image: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    imageSEO: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    scoreExcerpt: {
      data: {
        attributes: {
          name: string;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
          url: string;
        };
      } | null;
    };
    publishers: {
      data: IStrapiPublisher[] | null;
    };
    yearPublished: number;
    timeSignatures: {
      data: IStrapiTimeSignature[] | null;
    };
    keySignatures: {
      data: IStrapiKeySignature[] | null;
    };
    teachingTips: {
      data: IStrapiTeachingTip[] | null;
    };
    studentTypes: {
      data: IStrapiStudentType[] | null;
    };
    studentAges: {
      data: IStrapiStudentAge[] | null;
    };
    measureCount: number;
    moods: {
      data: IStrapiMood[] | null;
    };
    styles: {
      data: IStrapiStyle[] | null;
    };
    themes: {
      data: IStrapiTheme[] | null;
    };
    eras: {
      data: IStrapiEra[] | null;
    };
    holidays: {
      data: IStrapiHoliday[] | null;
    };
    instrumentations: {
      data: IStrapiInstrumentation[] | null;
    };
    hasLyrics: boolean;
    hasTeacherDuet: boolean;
    videoEmbedCode: string;
  };
}

export interface IStrapiPieceTable {
  id: number;
  title: string | undefined;
  composers: string[] | null;
  level: string | undefined;
  eras: string[] | null;
  order?: number | undefined;
  notes?: string | undefined;
  listId?: number | undefined;
  listWorkId?: number | undefined;
  owner?: boolean;
  user?: boolean;
}

export interface IStrapiComposerTable {
  id: number;
  attributes: {
    name: string;
  };
}

export interface IStrapiComposer {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    adminReview: string;
    name: string;
    excerpt: string;
    birth_year: string;
    death_year: string;
    nationality: string;
    ethnicity: string;
    gender: string;
    pronouns: string;
    urlSpotify: string;
    urlAppleMusic: string;
    urlWebsite: string;
    urlSocialInstagram: string;
    urlSocialFacebook: string;
    urlSocialX: string;
    urlSocialLinkedIn: string;
    urlSocialYouTube: string;
    image: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    imageSEO: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    works: {
      data: IStrapiPiece[] | null;
    };
    collections: {
      data: IStrapiCollection[] | null;
    };
    eras: {
      data: IStrapiEra[] | null;
    };
  };
}

export interface IStrapiPublisher {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    adminReview: string;
    name: string;
    excerpt: string;
    nationality: string;
    urlSpotify: string;
    urlAppleMusic: string;
    urlWebsite: string;
    urlSocialInstagram: string;
    urlSocialFacebook: string;
    urlSocialX: string;
    urlSocialLinkedIn: string;
    urlSocialYouTube: string;
    image: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    imageSEO: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    works: {
      data: IStrapiPiece[] | null;
    };
    collections: {
      data: IStrapiCollection[] | null;
    };
    eras: {
      data: IStrapiEra[] | null;
    };
  };
}

export interface IStrapiCollection {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    adminReview: string;
    title: string;
    description: string;
    catalogue_number: string;
    isbn_10: string;
    isbn_13: string;
    videoYouTube: string;
    urlSpotify: string;
    urlAppleMusic: string;
    urlWebsite: string;
    composed_date: string;
    composers: {
      data:
        | [
            {
              id: number;
              attributes: {
                name: string;
              };
            },
          ]
        | null;
    };
    published_date: string;
    publishers: {
      data:
        | [
            {
              id: number;
              attributes: {
                name: string;
              };
            },
          ]
        | null;
    };
    works: {
      data: IStrapiPiece[] | null;
    };
    purchase_link:
      | [
          {
            id: number;
            sellerName: string;
            url: string;
            linkText: string;
            sellerImage: {
              data: {
                attributes: {
                  name: string;
                  url: string;
                  width: number;
                  height: number;
                };
              };
            };
          },
        ]
      | null;
    image: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    imageSEO: {
      data: {
        attributes: {
          name: string;
          alternativeText: string;
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
            medium: {
              url: string;
              width: number;
              height: number;
            };
            thumbnail: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      } | null;
    };
    eras: {
      data: IStrapiEra[] | null;
    };
  };
}

export interface IStrapiElement {
  id: number;
  attributes: {
    publishedAt: string;
    name: string;
    level: string;
    description: string;
    rules: string;
    category: string;
    element_categories: {
      data: IStrapiCategory[] | null;
    };
    levels: {
      data: IStrapiLevel[] | null;
    };
    illustration: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      };
    };
  };
}

export interface IStrapiCategory {
  id: number;
  attributes: {
    name: string;
  };
}

export interface IStrapiLevel {
  id: number;
  attributes: {
    title: string;
    description: string;
    descriptionShort: string;
    isFeatured: boolean;
    isSearchable: boolean;
  };
}

export interface IStrapiEra {
  id: number;
  attributes: {
    name: string;
  };
}

export interface IStrapiHoliday {
  id: number;
  attributes: {
    name: string;
  };
}

export interface IStrapiInstrumentation {
  id: number;
  attributes: {
    name: string;
  };
}

export interface IStrapiStudentAge {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiStudentType {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiTeachingTip {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiMood {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiStyle {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiTheme {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiKeySignature {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiTimeSignature {
  id: number;
  attributes: {
    title: string;
  };
}

export interface IStrapiHomepageBanner {
  id: number;
  attributes: {
    BannerLink: string;
    BannerLinkTitle: string;
    BannerImage: {
      data: {
        attributes: {
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      };
    };
  };
}

export interface IStrapiEdits {
  data: IStrapiEdit[] | null;
}

export interface IStrapiEdit {
  id: number;
  attributes: {
    updatedAt: string;
    createdAt: string;
    status: string;
    type: string;
    field: string;
    reason: string;
    reasonRejected: string;
    currentContent: string;
    newContent: string;
    user: {
      data: IUserAttributes | null;
    };
    work: {
      data: IStrapiPiece | null;
    };
    collection: {
      data: IStrapiCollection | null;
    };
    publisher: {
      data: IStrapiPublisher | null;
    };
    composer: {
      data: IStrapiComposer | null;
    };
  };
}

export interface IStrapiPages {
  data: IStrapiPage[] | null;
}

export interface IStrapiPage {
  id: number;
  attributes: {
    name: string;
    slug: string;
    descriptionSEO: string;
    content: string;
    hideName: boolean;
    widthFull: boolean;
    showBackBar: boolean;
    showBackBarShare: boolean;
    showBackBarFeedback: boolean;
    showLastUpdated: boolean;
    updatedAt: string;
    image: {
      data: {
        attributes: {
          url: string;
          width: number;
          height: number;
          formats: {
            large: {
              url: string;
              width: number;
              height: number;
            };
            small: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      };
    };
  };
}

export interface IStrapiList {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    uid: string;
    title: string;
    description: string;
    details: string;
    visibility: {
      data: {
        id: number;
        attributes: {
          currentVisibility: string;
        };
      } | null;
    };
    owners: {
      data:
        | [
            {
              id: number;
              attributes: {
                name: string;
              };
            },
          ]
        | null;
    };
    users: {
      data:
        | [
            {
              id: number;
              attributes: {
                name: string;
              };
            },
          ]
        | null;
    };
    list_works:
      | [
          {
            createdAt: string;
            order: number;
            notes: string;
            work: {
              data: IStrapiPieceTable[] | null;
            };
          },
        ]
      | null;
  };
}

export interface IStrapiListWork {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    order: number;
    notes: string;
    work: {
      data: IStrapiPiece | null;
    };
  };
}

export interface IStrapiFavorite {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    user: {
      data: {
        id: number;
        attributes: {
          email: string;
        };
      } | null;
    };
    work: {
      data: IStrapiPiece | null;
    };
  };
}
