from flask import Flask,Response,json,jsonify
from flask_cors import CORS
from models import db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///reservation.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# 첫 실행 시 DB 생성
with app.app_context():
    db.create_all()

@app.route('/ping')
def ping():
    return Response(
        response=json.dumps({"message": "서버 정상 작동 중!"}, ensure_ascii=False),
        status=200,
        mimetype="application/json"
    )

from flask import request, Response, json
from models import db, User

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("서버로 전달된 데이터:", data)
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    print("서버 수신 값:", data)
    
    if not email or not password:
        return Response(
            response=json.dumps({"error": "이메일과 비밀번호를 모두 입력해주세요."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    if User.query.filter_by(email=email).first():
        return Response(
            response=json.dumps({"error": "이미 존재하는 이메일입니다."}, ensure_ascii=False),
            status=409,
            mimetype='application/json'
        )

    new_user = User(email=email, password=password, name=name)
    db.session.add(new_user)
    db.session.commit()

    return Response(
        response=json.dumps({"message": "회원가입 성공!"}, ensure_ascii=False),
        status=201,
        mimetype='application/json'
    )

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "이메일과 비밀번호를 모두 입력해주세요."}), 400

    user = User.query.filter_by(email=email).first()

    # 디버깅용 로그 출력
    if user:
        print("입력한 비밀번호:", password)
        print("DB에 저장된 비밀번호:", user.password)

    if user and user.password == password:
        return jsonify({
            "message": "로그인 성공!",
            "user_id": user.id,
            "name": user.name,
            "result": "success"
        }), 200
    else:
        return jsonify({
            "error": "이메일 또는 비밀번호가 올바르지 않습니다.",
            "result": "fail"
        }), 401


from flask import request, Response, json
from models import db, Table, Reservation
from datetime import datetime

@app.route('/api/tables', methods=['GET'])
def get_available_tables():
    date_str = request.args.get('date')
    time_slot = request.args.get('time')  # lunch or dinner

    if not date_str or time_slot not in ['lunch', 'dinner']:
        return Response(
            response=json.dumps({"error": "날짜와 시간(lunch 또는 dinner)을 정확히 입력해주세요."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            response=json.dumps({"error": "날짜 형식은 YYYY-MM-DD여야 합니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    # 예약된 테이블 ID 조회
    reserved_tables = Reservation.query.filter_by(date=date, time=time_slot).all()
    reserved_ids = [r.table_id for r in reserved_tables]

    # 사용 가능한 테이블만 필터링
    available_tables = Table.query.filter(~Table.id.in_(reserved_ids)).all()

    available_table_list = [
        {
            "table_id": table.id,
            "location": table.location,
            "capacity": table.capacity
        }
        for table in available_tables
    ]

    # 예약된 테이블 ID도 함께 응답
    return jsonify({
        "available_tables": available_table_list,
        "reserved_table_ids": reserved_ids
    })


@app.route('/init_tables', methods=['POST'])
def init_tables():
    # 이미 데이터 있으면 중복 삽입 방지
    if Table.query.first():
        return Response(
            response=json.dumps({"message": "이미 테이블 데이터가 존재합니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    tables = [
    Table(location='window', capacity=6),
    Table(location='window', capacity=2),
    Table(location='window', capacity=2),
    Table(location='window', capacity=2),
    Table(location='hall', capacity=6),
    Table(location='hall', capacity=4),
    Table(location='bar', capacity=1),
    Table(location='bar', capacity=1),
    Table(location='bar', capacity=1),
    Table(location='room', capacity=8),
    Table(location='room', capacity=2),
    Table(location='room', capacity=2),
    ]


    db.session.bulk_save_objects(tables)
    db.session.commit()

    return Response(
        response=json.dumps({"message": "테이블 데이터가 초기화되었습니다."}, ensure_ascii=False),
        status=201,
        mimetype='application/json'
    )

from datetime import datetime, timedelta

@app.route('/api/reserve', methods=['POST'])
def reserve():
    data = request.get_json()
    print("예약 요청 데이터:", data)
    name = data.get('name')
    phone = data.get('phone')
    card = data.get('card')
    guests = data.get('guests')
    table_id = data.get('table_id')
    date_str = data.get('date')
    user_id = data.get('user_id')
    time_slot = data.get('time')

    # 문자열 필드 유효성 검사
    required_fields = [name, phone, card, date_str]
    if any(field is None or str(field).strip() == '' for field in required_fields):
        return Response(
            response=json.dumps({"error": "모든 필드를 입력해주세요."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    # 숫자 필드 유효성 검사
    if table_id is None or guests is None or user_id is None:
        return Response(
            response=json.dumps({"error": "필수 숫자 값이 누락되었습니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    # 날짜 형식 검증
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            response=json.dumps({"error": "날짜 형식은 YYYY-MM-DD입니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    # 날짜 유효성 검사: 오늘부터 30일 이내만 가능
    today = datetime.today().date()
    if date < today or date > today + timedelta(days=30):
        return Response(
            response=json.dumps({"error": "예약 날짜는 오늘부터 30일 이내여야 합니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    # 중복 예약 확인
    existing = Reservation.query.filter_by(date=date, table_id=table_id).first()
    if existing:
        return Response(
            response=json.dumps({"error": "이미 예약된 테이블입니다."}, ensure_ascii=False),
            status=409,
            mimetype='application/json'
        )

    # 예약 저장
    reservation = Reservation(
        user_id=user_id,
        table_id=table_id,
        name=name,
        phone=phone,
        card=card,
        guests=guests,
        date=date,
        time=time_slot
    )
    db.session.add(reservation)
    db.session.commit()

    return Response(
        response=json.dumps({"message": "예약이 완료되었습니다!"}, ensure_ascii=False),
        status=201,
        mimetype='application/json'
    )


from datetime import datetime

@app.route('/api/reservations', methods=['GET'])
def get_user_reservations():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id가 필요합니다."}), 400

    reservations = Reservation.query.filter_by(user_id=user_id).all()

    result = []
    for r in reservations:
        result.append({
            "reservation_id": r.id,
            "date": r.date.strftime('%Y-%m-%d'),
            "time": r.time,
            "guests": r.guests,
            "table_id": r.table_id,
            "location": r.table.location if r.table else "알 수 없음"
        })

    return jsonify({"reservations": result})

@app.route('/api/cancel/<int:reservation_id>', methods=['DELETE'])
def cancel_reservation(reservation_id):
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return Response(
            response=json.dumps({"error": "user_id가 필요합니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    try:
        user_id = int(user_id)  
    except ValueError:
        return Response(
            response=json.dumps({"error": "user_id는 정수여야 합니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return Response(
            response=json.dumps({"error": "해당 예약을 찾을 수 없습니다."}, ensure_ascii=False),
            status=404,
            mimetype='application/json'
        )

    if reservation.user_id != user_id:
        return Response(
            response=json.dumps({"error": "본인의 예약만 취소할 수 있습니다."}, ensure_ascii=False),
            status=403,
            mimetype='application/json'
        )

    if reservation.date <= datetime.today().date():
        return Response(
            response=json.dumps({"error": "예약 당일에는 취소할 수 없습니다."}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    db.session.delete(reservation)
    db.session.commit()

    return Response(
        response=json.dumps({"message": "예약이 취소되었습니다."}, ensure_ascii=False),
        status=200,
        mimetype='application/json'
    )



if __name__ == '__main__':
    app.run(debug=True)
