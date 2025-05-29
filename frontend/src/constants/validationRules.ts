import {
    EWork,
    EComposer,
    EPublisher,
    ECollection,
    EFeedback,
    EAccountLogin,
    EAccountData
} from '.';

export const signUpRules: any = {
    [EAccountData.name]: {
        rule: (string: string) => string.length > 0,
        message: 'Please enter your name.'
    },
    [EAccountLogin.PASSWORD]: {
        rule: (string: string) => string.length > 7,
        message: 'Invalid password. Try again.'
    },
    [EAccountLogin.EMAIL]: {
        rule: (string: string) => string.length > 0,
        message: 'Please enter your email address.'
    }
};

export const logInRules: any = {
    [EAccountLogin.EMAIL]: {
        rule: (string: string) => string.length > 0,
        message: 'Enter a valid email'
    },
    [EAccountLogin.PASSWORD]: {
        rule: (string: string) => string.length > 7,
        message: 'Enter a password'
    }
};

export const resetPasswordRules: any = {
    [EAccountLogin.EMAIL]: {
        rule: (string: string) => string.length > 0,
        message: 'Invalid email address'
    }
};

export const accountSettingsRules: any = {
    [EAccountData.name]: {
        rule: (string: string) => string.length > 0,
        message: 'Enter your name'
    }
};

export const newsletterRules: any = {
    [EAccountData.name]: {
        rule: (string: string) => string.length > 0,
        message: 'Enter a name'
    },
    [EAccountData.email]: {
        rule: (string: string) => string.length > 0,
        message: 'Enter a valid email'
    }
};

export const unsubscribeRules: any = {
    [EAccountData.email]: {
        rule: (string: string) => string.length > 0,
        message: 'Enter a valid email'
    }
};

export const workRules: any = {
    [EWork.title]: {
        rule: (string: string) => string.length > 0 && string.length < 100,
        message: 'Enter a title (Max 100 characters)'
    },
    [EWork.alternateTitle]: {
        rule: (string: string) => string.length < 100,
        message: 'Alternate title too long (Max 100 characters)'
    },
    [EWork.videoEmbedCode]: {
        rule: (string: string) => string.length < 100,
        message: 'Video URL too long (Max 100 characters)'
    }
};

export const composerRules: any = {
    [EComposer.name]: {
        rule: (string: string) => string.length > 0 && string.length < 100,
        message: 'Enter a composer name (Max 100 characters)'
    },
    [EComposer.nationality]: {
        rule: (string: string) => string.length < 1000,
        message: 'Nationality too long (Max 1000 characters)'
    },
    [EComposer.excerpt]: {
        rule: (string: string) => string.length < 1000,
        message: 'Bio too long (Max 1000 characters)'
    }
};

export const publisherRules: any = {
    [EPublisher.name]: {
        rule: (string: string) => string.length > 0 && string.length < 100,
        message: 'Enter a publisher name (Max 100 characters)'
    },
    [EPublisher.nationality]: {
        rule: (string: string) => string.length < 1000,
        message: 'Nationality too long (Max 1000 characters)'
    },
    [EPublisher.excerpt]: {
        rule: (string: string) => string.length < 1000,
        message: 'Description too long (Max 1000 characters)'
    }
};

export const collectionRules: any = {
    [ECollection.title]: {
        rule: (string: string) => string.length > 0 && string.length < 100,
        message: 'Enter a collection title (Max 100 characters)'
    },
    [ECollection.description]: {
        rule: (string: string) => string.length < 1000,
        message: 'Description too long (Max 1000 characters)'
    }
};

export const feedbackRules: any = {
    [EFeedback.feedbackText]: {
        rule: (string: string) => string.length > 0 && string.length < 1000,
        message: 'Enter feedback (Max 1000 characters)'
    },
    [EFeedback.feedbackEmail]: {
        rule: (string: string) => string.length < 1000,
        message: 'Email too long (Max 1000 characters)'
    }
};

export const videoNullRules: any = {
    [EFeedback.feedbackText]: {
        rule: (string: string) => string.length > 0 && string.length < 1000,
        message: 'Enter a video URL (Max 1000 characters)'
    },
    [EFeedback.feedbackEmail]: {
        rule: (string: string) => string.length < 1000,
        message: 'Email too long (Max 1000 characters)'
    }
};
