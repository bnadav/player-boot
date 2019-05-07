NITE.Translation = function(lang)
{
  this.lang = lang;
  this.he = {
    communication_failure : "בעיית תקשורת",
    mark_reminder : "סימון תזכורת",
    cancel_reminder : "ביטול תזכורת",
    unaswered_questions_found : "ישנן שאלות שלא נענו ",
    about_to_start_exam : " כעת יתחיל המבחן עצמו. האם ברצונך לעבור למבחן ?",
    about_to_finish_exam :  " האם ברצונך לסיים את המבחן ?",
    about_to_move_chapter : " האם ברצונך לעבור לפרק הבא ?",
    about_to_save_changes_to_chapter: "האם ברצונך לשמור את השינויים שנעשו לפרק?",
    about_to_close_chapter: "האם ברצונך לסיים את הפרק ?",
    explanations_chapter : "פרק הסברים",
    chapter_number : "פרק",
    to_explanations : ":להסברים",
    to_chapter : ":לפרק",
    mathematics : "מתמטיקה",
    quantitive_reasoning :  "חשיבה כמותית",
    hebrew : "עברית",
    verbal_reasoning : "חשיבה מילולית",
    english : "אנגלית",
    writing : "חיבור",
    enter_text_here : "הקלידו את החיבור כאן",
    start_exam :  "לתחילת המבחן",
    end : "סיום",
    next_chapter :"לפרק הבא",
    to_instructions:   ":להסברים",
    to_chapter:    ":לפרק",
    close_formulas_page: "סגירה",
    exam : {
      side: {
        hasaka:           "הסקה",
        הסקה_מתרשים:      "תרשים",
        הסקה_מטבלה:       "טבלה",
        explanations:     "הסברים" ,
        instructions:     "הוראות",
        drawing:          "תרשים",
        text:             "קטע קריאה",
        sentence_completions:  "השלמת משפטים",
        reading_comprehension: "קטע קריאה",
        formulas_button:  "דף נוסחאות",
        question:         "שאלה ",
        mark_question_title:  "לסמן את השאלה",
        next:             "<< קדימה",
        show_next_question_title : "הצג שאלה הבאה",
        time_left:        "הזמן  הנותר",
        word_count:   "מונה מילים",
        restatements:   "ניסוח מחדש" 
      }
    },
    domains: {
     VE: "עברית",
     EN: "אנגלית",
     QU: "מתמטיקה"
    }
  };

  this.en = {
    communication_failure : "בעיית תקשורת",
    mark_reminder : "Flag Question",
    cancel_reminder : "Unflag",
    unaswered_questions_found : "There are unaswered questions ",
    about_to_start_exam : "Start test ?",
    about_to_finish_exam :  "Finish test ?",
    about_to_move_chapter : "Move to next section ?",
    about_to_save_changes_to_chapter: "Save Changes to chapter?",
    about_to_close_chapter: "Finish Chapter?",
    explanations_chapter : "Instructions",
    chapter_number : "Section",
    to_explanations : ":להסברים",
    to_chapter : "",
    mathematics : "מתמטיקה",
    quantitive_reasoning :  "חשיבה כמותית",
    hebrew : "חשיבה כמותית",
    verbal_reasoning : "חשיבה מילולית",
    english : "Amir",
    start_exam :  "Start test",
    end : "Finish",
    next_chapter :"To next section",
    to_instructions:   ":להסברים",
    to_chapter:    "",
    close_formulas_page: "close  X",
    exam : {
      side: {
        הוראות: "Instructions",
              تعليمات : "Instructions",
        general_explanations: "הסברים כללים",
        exam_operation:  "תפעול המבחן",
        time_allocation: "הקצבת הזמן",
        practice_questions: "שאלות לדוגמה",
        end_of_explanations: "סיום ההסברים",
        explanations:     "Explanations" ,
        instructions:     "Instructions",
        drawing:          "תרשים",
        text:             "Text",
        formulas_button:  "דף נוסחאות",
        question:         "question ",
        mark_question_title:  "לסמן את השאלה",
        next:             "NEXT >>",
        show_next_question_title : "הצג שאלה הבאה",
        time_left:        "Time left:",
        reading_comprehension: "Text" 
      }
    }
  };



  this.ar = {
    communication_failure : "مشكلة في الاتّصال",
    mark_reminder : "إشارة تذكير",
    cancel_reminder : "إلغاء الإشارة",
    unaswered_questions_found : "هنالك أسئلة لم تجب عليها",
    about_to_start_exam : "الآن يبدأ الامتحان. هل ترغب في الانتقال إلى الامتحان?",
    about_to_finish_exam :  "هل ترغب في إنهاء الامتحان?",
    about_to_move_chapter : "هل ترغب في الانتقال إلى الفصل التّالي?",
    about_to_save_changes_to_chapter: "האם ברצונך לשמור את השינויים שנעשו לפרק?",
    about_to_close_chapter: "האם ברצונך לסיים את הפרק ?",
    explanations_chapter : "فصل شروح",
    chapter_number : "رقم الفصل",
    to_explanations : ":إلى الشّروح",
    to_chapter : ":إلى فصل",
    mathematics : "رياضيّات",
    quantitive_reasoning :  "تفكير كمّي",
    hebrew : "تفكير كمّي",
    verbal_reasoning : "تفكير كلامي",
    english : "إنكليزيّة",
    enter_text_here : " عليك أن تكتب الإنشاء هنا",
    start_exam :  "انتقل للامتحان",
    end : "نهاية",
    next_chapter :"إلى الفصل التّالي",
    writing: "مهمّة تعبير كتابيّ",
    to_instructions:   ":إلى الشّروح",
    to_chapter:    ":إلى فصل",
    exam : {
      side: {
        general_explanations: "شروح عامّة",
        exam_operation:  "تشغيل الامتحان",
        time_allocation: "تخصيص الوقت",
        practice_questions: "أسئلة للتّمرّن",
        end_of_explanations: "نهاية الشّروح",
        explanations:     "شروح" ,
        instructions:     "تعليمات",
        drawing:          "رسم بياني",
        text:             "قطعة قراءة",
        sentence_completions:  "إكمال جمل",
        reading_comprehension: "قطعة قراءة",
        restatements:   "إعادة الصّياغة" ,
        formulas_button:  "صفحة القوانين",
        question:         "سؤال ",
        mark_question_title:  "أشر إلى السّؤال",
        next:             "<< إلى الأمام",
        show_next_question_title : "اعرض السّؤال التّالي",
        time_left:        "الوقت المتبقّي",
        word_count:   "عدد الكلمات",
        שאלות_ובעיות: "مسائل رياضيّة",
        מטלת_כתיבה: "מטלת כתיבה בערבית",    
        הסקה_מטבלה: "جدول",
        הסקה_מתרשים: "رسم بيانيّ",
        מילים_וביטויים: "كلمات وتعابير",
        השלמת_משפטים: "إكمال جمل",
        קטע_קריאה: "قطعة قراءة",
        הוראות: "تعليمات",
        אנלוגיות:"قطعة قراءة",
        שאלות_הבנה_והסקה:"أسئلة فهم واستنتاج",
        הפכים: "أضداد"
      }
    }

  };

  this.translation_object = this[lang];

};

