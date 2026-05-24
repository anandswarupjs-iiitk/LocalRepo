const generateConfidence = (riskResult) => {

    const {

        riskScore,
        reasons

    } = riskResult;


    let confidence = 100;


    // Lower confidence if fewer signals exist
    confidence -=
        (4 - reasons.length) * 10;


    confidence =
        Math.max(
            50,
            confidence
        );


    let recommendation;


    if (riskScore >= 70) {

        recommendation =
            "Block transaction immediately";

    }

    else if (riskScore >= 50) {

        recommendation =
            "Require additional verification";

    }

    else {

        recommendation =
            "Allow transaction";

    }


    return {

        confidencePercentage:
            `${confidence}%`,

        reasonBreakdown:
            reasons,

        recommendation

    };

};


module.exports =
generateConfidence;