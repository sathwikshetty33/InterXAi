from rest_framework import serializers
from .models import *



class CustomQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customquestion
        fields = ["question", "answer"]

class DsaTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = DsaTopics
        fields = ["topic", "difficulty", "number_of_questions"]

class CustomInterviewSerializer(serializers.ModelSerializer):
    questions = CustomQuestionSerializer(many=True)
    dsa_topics = DsaTopicSerializer(many=True)

    class Meta:
        model = Custominterviews
        fields = [
            "desc",
            "post",
            "experience",
            "submissionDeadline",
            "startTime",
            "endTime",
            "duration",
            "DSA",
            "Dev",
            "ask_questions_on_resume",
            "questions",
            "dsa_topics",
        ]

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        dsa_topics_data = validated_data.pop("dsa_topics", [])

        interview = Custominterviews.objects.create(**validated_data)

        for q in questions_data:
            Customquestion.objects.create(interview=interview, **q)

        for d in dsa_topics_data:
            DsaTopics.objects.create(interview=interview, **d)

        return interview