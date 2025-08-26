from rest_framework import renderers
import json 

class userRenderer(renderers.JSONRenderer):
  """
    Custom JSON renderer for API responses.

    This renderer ensures that errors are always wrapped in an 'errors' key 
    to maintain consistency across client responses.
  """
  charset='utf-8'
  
  def render(self,data,accepted_media_type=None,renderer_context=None):
    """
        Render the response data into JSON format.

        Args:
            data (dict): The data to render (usually from serializers).
            accepted_media_type (str, optional): The accepted media type.
            renderer_context (dict, optional): Context such as request or response.

        Returns:
            str: A JSON-formatted string response.
                - If errors are present, they are wrapped under the 'errors' key.
                - Otherwise, data is returned as-is in JSON format.
    """
    response = '' 
    if 'ErrorDetail' in str(data):
      response = json.dumps({'errors':data})
    else:
      response = json.dumps(data)
      
    return response