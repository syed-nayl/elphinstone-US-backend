// TO DO: Add Dependencies to this for better error messages.

const accountCreationSchema = {
    // "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "enabled_assets": {
        "type": "array",
        "items": [
          {
            "type": "string",
            "enum": ["us_equity"]
          }
        ]
      },
      "contact": {
        "type": "object",
        "properties": {
          "email_address": {
            "type": "string",
          },
          "phone_number": {
            "type": "string"
          },
          "street_address": {
            "type": "array",
            "minItems":1,
            "maxItems": 3,
            "items": [
              {
                "type": "string"
              }
            ]
          },
          "city": {
            "type": "string"
          },
          "state": {
            "type": "string"
          },
          "postal_code": {
            "type": "string"
          },
          "country": {
            "type": "string"
          }
        },
        "required": [
          "email_address",
          "phone_number",
          "street_address",
          "state",
          "city",
          "country"
        ]
      },
      "identity": {
        "type": "object",
        "properties": {
          "given_name": {
            "type": "string"
          },
          "middle_name": {
            "type": "string"
          },
          "family_name": {
            "type": "string"
          },
          "date_of_birth": {
            "type": "string"
          },
          "tax_id": {
            "type": "string"
          },
          "tax_id_type": {
            "type": "string"
          },
          "country_of_citizenship": {
            "type": "string"
          },
          "country_of_birth": {
            "type": "string"
          },
          "country_of_tax_residence": {
            "type": "string"
          },
          "annual_income_max": {
            "type": "string"
          },          
          "liquid_net_worth_max": {
            "type": "string"
          },
          "visa_type": {
            "type": "string"
          },
          "permanent_resident": {
            "type": "boolean"
          },
          "funding_source": {
            "type": "array",
            "items": [
              {
                "type": "string",
                "enum": ["employment_income","investments","inheritance","business_income","savings","family"]
              }
            ]
          }
        },
        "required": [
          "given_name",
          "family_name",
          "date_of_birth",
          "country_of_tax_residence",
          "funding_source",
          "annual_income_max",
          "liquid_net_worth_max"
        ]
      },
      "disclosures": {
        "type": "object",
        "properties": {
          "is_control_person": {
            "type": "boolean"
          },
          "is_affiliated_exchange_or_finra": {
            "type": "boolean"
          },
          "is_politically_exposed": {
            "type": "boolean"
          },
          "immediate_family_exposed": {
            "type": "boolean"
          },
          "employment_status": {
            "type": "string",
            "enum": ["UNEMPLOYED","EMPLOYED","STUDENT","RETIRED"]
          },
          "employer_name": {
            "type": "string"
          },
          "employer_address": {
            "type": "string"
          },
          "employment_position": {
            "type": "string"
          },
          
          "context": {
            "type": "array",
            "items": [
              {
                "type": "object",
                "properties": {
                  "context_type": {
                    "type": "string",
                    "enums": ["CONTROLLED_FIRM","IMMEDIATE_FAMILY_EXPOSED","AFFILIATE_FIRM"]
                  },
                  "company_name": {
                    "type": "string"
                  },
                  "company_street_address": {
                    "type": "array",
                    "items": [
                      {
                        "type": "string"
                      }
                    ]
                  },
                  "company_city": {
                    "type": "string"
                  },
                  "company_state": {
                    "type": "string"
                  },
                  "company_country": {
                    "type": "string"
                  },
                  "company_compliance_email": {
                    "type": "string"
                  },
                  "given_name": {
                    "type": "string"
                  },
                  "family_name": {
                    "type": "string"
                  },
                },
                "required": [
                  "context_type",
                ]
              }
            ]
          }
        },
        "required": [
          "is_control_person",
          "is_affiliated_exchange_or_finra",
          "is_politically_exposed",
          "immediate_family_exposed",
          "employment_status"
        ]
      },
      "agreements": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "agreement": {
                "type": "string",
                "enum": ["margin_agreement","account_agreement","customer_agreement"]
              },
              "signed_at": {
                "type": "string"
              },
              "ip_address": {
                "type": "string"
              },
              "revision": {
                "type": "string"
              }
            },
            "required": [
              "agreement",
              "signed_at",
              "ip_address",
            ]
          },
        ]
      },
      "documents": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "document_type": {
                "type": "string",
                "enum": ["identity_verification","address_verification","date_of_birth_verification","tax_id_verification","account_approval_letter","w8ben","w9"]
              },
              "document_sub_type": {
                "type": "string"
              },
              "content": {
                "type": "string"
              },
              "mime_type": {
                "type": "string"
              }
            },
            "required": [
              "document_type",
              "content",
              "mime_type"
            ]
          }
        ]
      },
      "trusted_contact": {
        "type": "object",
        "properties": {
          "given_name": {
            "type": "string"
          },
          "family_name": {
            "type": "string"
          },
          "email_address": {
            "type": "string"
          }
        },
        "required": [
          "given_name",
          "family_name",
          "email_address"
        ]
      }
    },
    "required": [
      "contact",
      "identity",
      "disclosures",
      "agreements",
      "documents",
      "trusted_contact"
    ]
  }

  export {accountCreationSchema}