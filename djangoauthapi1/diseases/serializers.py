from rest_framework import serializers
from .models import Pneumonia


class PneumoniaSerializer(serializers.ModelSerializer):
    """
    Serializer for uploading a new Pneumonia X-ray and returning prediction status.

    Fields:
        user (StringRelatedField): Read-only field representing the uploader.
        image (ImageField): The chest X-ray file to be uploaded and processed.
        predicted_text (CharField): Read-only AI-generated diagnosis result.

    Methods:
        create(validated_data): Associates the current user with the upload and creates a new Pneumonia record.
    """
    user = serializers.StringRelatedField(read_only=True)
    image = serializers.ImageField()
    predicted_text = serializers.CharField(read_only=True)

    class Meta:
        model = Pneumonia
        fields = ['user', 'image', 'predicted_text']

    def create(self, validated_data):
        """
        Create and return a new Pneumonia instance, assigning the requesting user.

        Args:
            validated_data (dict): The validated data from the request.

        Returns:
            Pneumonia: The newly created Pneumonia model instance.
        """
        user = self.context['request'].user
        return Pneumonia.objects.create(user=user, **validated_data)


class GetPneumoniaSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving Pneumonia records with image and prediction.

    Fields:
        user (StringRelatedField): Read-only uploader representation.
        image (ImageField): The chest X-ray file URL.
        predicted_text (CharField): The AI-generated diagnosis result.
    """
    user = serializers.StringRelatedField(read_only=True)
    image = serializers.ImageField()
    predicted_text = serializers.CharField(read_only=True)

    class Meta:
        model = Pneumonia
        fields = ['user', 'image', 'predicted_text']




