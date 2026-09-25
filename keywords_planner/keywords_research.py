#!/usr/bin/env python3
"""Refresh a UAE English keyword catalog from the Google Ads Keyword Planner.

The planner is deliberately data-first: it records Google's monthly search
volume, competition and top-of-page bids rather than asking an LLM to invent
keyword demand.  Each run creates a timestamped snapshot; do not overwrite a
prior catalog because it is useful for spotting demand changes over time.
"""

import glob
import json
import os
import sys
import tempfile
from datetime import datetime, timedelta, timezone

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
except ModuleNotFoundError:
    pass

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException


# Search wording used by real UAE buyers and their designers.  Dubai terms are
# paired with broader UAE wording where the service is supplied across the UAE.
SEEDS = [
    "joinery dubai", "joinery company dubai", "bespoke joinery dubai",
    "custom joinery dubai", "joinery factory dubai", "woodwork dubai",
    "architectural joinery dubai", "joinery contractors dubai",
    "custom wardrobes dubai", "built in wardrobes dubai", "fitted wardrobes dubai",
    "walk in wardrobe dubai", "wardrobe design dubai", "sliding wardrobes dubai",
    "custom kitchens dubai", "bespoke kitchens dubai", "kitchen cabinets dubai",
    "kitchen joinery dubai", "kitchen design dubai", "custom kitchen cabinets",
    "custom doors dubai", "wooden doors dubai", "pivot doors dubai",
    "flush doors dubai", "sliding doors dubai", "interior doors dubai",
    "wall panelling dubai", "wall panels dubai", "fluted wall panels dubai",
    "wood paneling dubai", "acoustic wall panels dubai", "feature wall dubai",
    "wood ceiling dubai", "wooden ceiling dubai", "slatted ceiling dubai",
    "custom tv unit dubai", "media wall dubai", "tv cabinet dubai",
    "reception desk dubai", "custom reception desk dubai", "office furniture dubai",
    "conference table dubai", "bespoke furniture dubai", "custom furniture dubai",
    "villa joinery dubai", "apartment joinery dubai", "office joinery dubai",
    "restaurant joinery dubai", "hotel joinery dubai", "retail joinery dubai",
    # Repair and maintenance demand: buyers arriving with joinery that already
    # exists, frequently installed by somebody else. Different intent from the
    # seeds above, so it needs its own seeds rather than relying on expansion.
    "furniture repair dubai", "furniture restoration dubai", "furniture polishing dubai",
    "joinery maintenance dubai", "joinery repair dubai", "wood repair dubai",
    "wardrobe repair dubai", "kitchen cabinet repair dubai", "cabinet repair dubai",
    "door repair dubai", "carpentry services dubai", "carpenter dubai",
    "annual maintenance contract dubai", "office furniture repair dubai",
    "furniture maintenance dubai", "wood restoration dubai",
]

GEO_UAE = "geoTargetConstants/2784"
LANG_EN = "languageConstants/1000"
NEGATIVE = ("job", "salary", "vacancy", "course", "software", "game", "free download", "pdf")
TZ = timezone(timedelta(hours=4))
HERE = os.path.dirname(os.path.abspath(__file__))
STAMP = datetime.now(TZ).strftime("%Y-%m-%d_%H-%M-%S")
OUT = os.environ.get("KEYWORDS_JSON", os.path.join(HERE, f"{STAMP}_keywords.json"))


def client():
    return GoogleAdsClient.load_from_dict({
        "developer_token": os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "client_id": os.environ["GOOGLE_ADS_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token": os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
        "login_customer_id": os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"],
        "use_proto_plus": True,
    })


def fetch_ideas(ads_client):
    service = ads_client.get_service("KeywordPlanIdeaService")
    rows = {}
    # Broad consumer terms (such as kitchens and wardrobes) return a much
    # wider idea set than permit queries. Smaller batches are slower overall
    # but much less likely to hit the API's response deadline.
    for start in range(0, len(SEEDS), 10):
        request = ads_client.get_type("GenerateKeywordIdeasRequest")
        request.customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
        request.language = LANG_EN
        request.geo_target_constants.append(GEO_UAE)
        request.include_adult_keywords = False
        request.keyword_plan_network = ads_client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH
        request.keyword_seed.keywords.extend(SEEDS[start : start + 10])

        for idea in service.generate_keyword_ideas(request=request):
            text = idea.text.lower()
            if any(term in text for term in NEGATIVE) or text in rows:
                continue
            metrics = idea.keyword_idea_metrics
            rows[text] = {
                "text": idea.text,
                "avg_monthly_searches": int(metrics.avg_monthly_searches or 0),
                "competition": metrics.competition.name,
                "competition_index": int(metrics.competition_index or 0),
                "cpc_low": round((metrics.low_top_of_page_bid_micros or 0) / 1e6, 2),
                "cpc_high": round((metrics.high_top_of_page_bid_micros or 0) / 1e6, 2),
            }
    return sorted(rows.values(), key=lambda row: (row["cpc_high"], row["avg_monthly_searches"]), reverse=True)


def previous_used():
    for path in reversed(sorted(glob.glob(os.path.join(HERE, "*_keywords.json")))):
        if os.path.abspath(path) == os.path.abspath(OUT):
            continue
        try:
            return json.load(open(path, encoding="utf-8")).get("used", [])
        except (json.JSONDecodeError, OSError):
            pass
    return []


def save(rows):
    catalog = {
        "generated_at": datetime.now(TZ).isoformat(timespec="seconds"),
        "geo": "United Arab Emirates",
        "language": "English",
        "currency": "AED",
        "seeds": SEEDS,
        "count": len(rows),
        "keywords": rows,
        "used": previous_used(),
    }
    fd, temporary_path = tempfile.mkstemp(dir=HERE, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as file:
        json.dump(catalog, file, indent=2, ensure_ascii=False)
    os.replace(temporary_path, OUT)
    return catalog


def main():
    try:
        catalog = save(fetch_ideas(client()))
        top = ", ".join(row["text"] for row in catalog["keywords"][:3]) or "(no ideas returned)"
        print(f"OK: {catalog['count']} UAE keywords → {OUT}. Top CPC terms: {top}")
    except GoogleAdsException as error:
        print(f"ERROR: Google Ads API: {error.error.code().name} — {error.failure.errors[0].message}", file=sys.stderr)
        return 1
    except Exception as error:
        print(f"ERROR: keyword research failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
